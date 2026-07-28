import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LinkBreakIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { DependencyCustomNode } from "./dependency-custom-node";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { Issue } from "@/types/issue.types";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { EmptyState } from "@/components/ui/data-display/empty-state";

import {
  formatDependencyLabel,
  calculateDependencyRiskLevel,
} from "@/features/deps/utils/deps.utils";

interface DependencyNodeGraphProps {
  projectId?: string;
}

export function DependencyNodeGraph({ projectId }: DependencyNodeGraphProps) {
  const { data: issuesResponse, isLoading } = useIssues(projectId || "");
  const realIssues: Issue[] = useMemo(
    () => issuesResponse?.data?.data || [],
    [issuesResponse],
  );

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!realIssues || realIssues.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    const issueMap = new Map(realIssues.map((item) => [item.id, item]));

    const rawEdges: {
      source: string;
      target: string;
      label: string;
      isCritical: boolean;
      isSubtask: boolean;
    }[] = [];

    realIssues.forEach((issue) => {
      // Process explicit links
      if (Array.isArray(issue.links)) {
        issue.links.forEach((link) => {
          const targetId = typeof link === "string" ? link : link.targetIssueId;
          const linkType =
            typeof link === "string" ? "blocks" : link.type || "blocks";

          if (targetId && issueMap.has(targetId)) {
            const riskLevel = calculateDependencyRiskLevel(issue, linkType);
            const isCritical = riskLevel === "critical";

            rawEdges.push({
              source: issue.id,
              target: targetId,
              label: formatDependencyLabel(linkType),
              isCritical,
              isSubtask: false,
            });
          }
        });
      }

      // Process parent-child subtask dependencies
      if (issue.parentId && issueMap.has(issue.parentId)) {
        rawEdges.push({
          source: issue.parentId,
          target: issue.id,
          label: formatDependencyLabel("subtask"),
          isCritical: false,
          isSubtask: true,
        });
      }
    });

    // 1. Calculate BFS levels with cycle protection
    const levelMap = new Map<string, number>();
    realIssues.forEach((issue) => levelMap.set(issue.id, 0));

    const targetsSet = new Set(rawEdges.map((e) => e.target));
    const visited = new Set<string>();
    const queue: { id: string; lvl: number }[] = [];

    realIssues.forEach((issue) => {
      if (!targetsSet.has(issue.id)) {
        queue.push({ id: issue.id, lvl: 0 });
        visited.add(issue.id);
      }
    });

    if (queue.length === 0 && realIssues.length > 0) {
      queue.push({ id: realIssues[0].id, lvl: 0 });
      visited.add(realIssues[0].id);
    }

    let head = 0;
    while (head < queue.length) {
      const item = queue[head++];
      levelMap.set(item.id, item.lvl);

      rawEdges
        .filter((e) => e.source === item.id)
        .forEach((e) => {
          if (!visited.has(e.target)) {
            visited.add(e.target);
            queue.push({ id: e.target, lvl: item.lvl + 1 });
          }
        });
    }

    // Default remaining unvisited nodes
    realIssues.forEach((issue) => {
      if (!visited.has(issue.id)) {
        levelMap.set(issue.id, 0);
      }
    });

    // 2. Dense Ranking Level Compression with Max 3 Cards per Column
    const sortedUniqueLevels = Array.from(
      new Set(Array.from(levelMap.values())),
    ).sort((a, b) => a - b);

    const columnNodes: Map<number, Issue[]> = new Map();
    realIssues.forEach((issue) => {
      const rawLvl = levelMap.get(issue.id) || 0;
      if (!columnNodes.has(rawLvl)) columnNodes.set(rawLvl, []);
      columnNodes.get(rawLvl)!.push(issue);
    });

    const MAX_PER_COL = 3;
    const COL_WIDTH = 360;
    const ROW_HEIGHT = 170;

    const mappedNodes: Node[] = [];
    let currentXOffset = 0;

    sortedUniqueLevels.forEach((lvl) => {
      const issuesInLevel = columnNodes.get(lvl) || [];
      issuesInLevel.forEach((issue, index) => {
        const subCol = Math.floor(index / MAX_PER_COL);
        const subRow = index % MAX_PER_COL;

        let risk: "critical" | "warning" | "resolved" = "resolved";
        const pLower = (issue.priority || "").toLowerCase();
        const sLower = (issue.status || "").toLowerCase();

        if (pLower === "critical" || pLower === "high") {
          risk = "critical";
        } else if (sLower !== "done" && sLower !== "completed") {
          risk = "warning";
        }

        mappedNodes.push({
          id: issue.id,
          type: "dependencyNode",
          position: {
            x: 40 + (currentXOffset + subCol) * COL_WIDTH,
            y: 40 + subRow * ROW_HEIGHT,
          },
          data: {
            key: issue.issueKey || `TSK-${issue.id.slice(0, 4)}`,
            title: issue.summary || "Untitled Issue",
            assignee: issue.assigneeId || "Chưa phân công",
            avatar: undefined,
            status: issue.status || "Todo",
            risk,
          },
        });
      });

      const colsUsed = Math.ceil(issuesInLevel.length / MAX_PER_COL);
      currentXOffset += Math.max(1, colsUsed);
    });

    const nodePosMap = new Map<string, { x: number; y: number }>();
    mappedNodes.forEach((n) => nodePosMap.set(n.id, n.position));

    // Map edges with dynamic 4-way shortest path handle routing
    const mappedEdges: Edge[] = rawEdges.map((re, idx) => {
      const posA = nodePosMap.get(re.source) || { x: 0, y: 0 };
      const posB = nodePosMap.get(re.target) || { x: 0, y: 0 };

      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;

      let sourceHandle: string;
      let targetHandle: string;

      if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx >= 0) {
          sourceHandle = "source-right";
          targetHandle = "target-left";
        } else {
          sourceHandle = "source-left";
          targetHandle = "target-right";
        }
      } else if (dy >= 0) {
        sourceHandle = "source-bottom";
        targetHandle = "target-top";
      } else {
        sourceHandle = "source-top";
        targetHandle = "target-bottom";
      }

      const isCritical = re.isCritical;
      const isSubtask = re.isSubtask;

      const strokeColor = isCritical
        ? "#f43f5e"
        : isSubtask
          ? "#10b981"
          : "#3b82f6";

      return {
        id: `edge-${re.source}-${re.target}-${idx}`,
        source: re.source,
        target: re.target,
        sourceHandle,
        targetHandle,
        type: "default",
        animated: isCritical,
        label: isCritical || isSubtask ? re.label : undefined,
        style: {
          stroke: strokeColor,
          strokeWidth: isCritical ? 2.5 : 2,
        },
        labelStyle: {
          fill: strokeColor,
          fontWeight: 700,
          fontSize: 10.5,
        },
        labelBgStyle: { fill: "#111827", fillOpacity: 0.95, rx: 6, ry: 6 },
        labelBgPadding: [5, 3],
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14,
        },
      };
    });

    return { initialNodes: mappedNodes, initialEdges: mappedEdges };
  }, [realIssues]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleAutoLayout = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const nodeTypes = useMemo(
    () => ({
      dependencyNode: DependencyCustomNode,
    }),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "default",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const { connectedNodeIds, connectedEdgeIds } = useMemo(() => {
    if (!hoveredNodeId) {
      return {
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      };
    }
    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();
    nodeSet.add(hoveredNodeId);

    edges.forEach((e) => {
      if (e.source === hoveredNodeId) {
        nodeSet.add(e.target);
        edgeSet.add(e.id);
      } else if (e.target === hoveredNodeId) {
        nodeSet.add(e.source);
        edgeSet.add(e.id);
      }
    });

    return { connectedNodeIds: nodeSet, connectedEdgeIds: edgeSet };
  }, [hoveredNodeId, edges]);

  const displayNodes = useMemo(() => {
    if (!hoveredNodeId) return nodes;
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: connectedNodeIds.has(node.id),
        isDimmed: !connectedNodeIds.has(node.id),
      },
    }));
  }, [nodes, hoveredNodeId, connectedNodeIds]);

  const displayEdges = useMemo(() => {
    if (!hoveredNodeId) return edges;
    return edges.map((edge) => {
      const isConnected = connectedEdgeIds.has(edge.id);
      return {
        ...edge,
        animated: isConnected || edge.animated,
        style: {
          ...edge.style,
          strokeWidth: isConnected ? 3.5 : 1,
          opacity: isConnected ? 1 : 0.15,
        },
      };
    });
  }, [edges, hoveredNodeId, connectedEdgeIds]);

  return (
    <div className="flex-1 flex flex-col min-h-135 bg-card border border-border/80 rounded-2xl p-4 shadow-2xs relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-xs z-30 flex items-center justify-center text-xs text-muted-foreground font-medium animate-in fade-in duration-200">
          Đang tải sơ đồ phụ thuộc từ API...
        </div>
      )}

      {/* Header Legend & Auto Layout Action */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-[13px] font-semibold text-foreground tracking-tight">
            React Flow Dependency Network
          </h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-[11.5px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Critical Blocker</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>In Progress</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Unblocked / Ready</span>
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAutoLayout}
          variant={ButtonVariant.Outline}
          size={ButtonSize.Sm}
          className="h-7 px-3 text-[11.5px] font-semibold gap-1.5 rounded-full cursor-pointer shadow-2xs shrink-0"
        >
          <SparkleIcon className="w-3.5 h-3.5 text-primary" />
          <span>Sắp xếp tự động</span>
        </Button>
      </div>

      {/* React Flow Interactive Graph Canvas */}
      <div className="flex-1 w-full relative min-h-120 pt-2 rounded-xl overflow-hidden flex flex-col">
        {!isLoading && nodes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-background/20 rounded-xl border border-dashed border-border/60">
            <EmptyState
              icon={LinkBreakIcon}
              title="Chưa có phụ thuộc nào"
              description="Dự án hiện chưa tạo liên kết phụ thuộc hoặc tác vụ con giữa các công việc."
            />
          </div>
        ) : (
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            className="bg-background/40"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={18}
              size={1.5}
              color="rgba(148, 163, 184, 0.25)"
            />
            <Controls className="bg-card! border-border! rounded-xl! shadow-md! text-foreground" />
            <MiniMap
              zoomable
              pannable
              nodeColor={(node) => {
                const data = node.data as { risk?: string };
                if (data?.risk === "critical") return "#f43f5e";
                if (data?.risk === "warning") return "#f59e0b";
                return "#10b981";
              }}
              className="bg-card/90! border-border! rounded-xl! overflow-hidden shadow-md"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
