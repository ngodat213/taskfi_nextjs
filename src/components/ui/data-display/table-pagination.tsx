import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
;
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

export interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  page,
  limit,
  total,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  className,
}: TablePaginationProps) {
  const t = useTranslations("Pagination");

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border px-4 py-3 sm:px-6",
        className,
      )}
    >
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] text-foreground">
            {t("showing")}{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
            {t("to")}{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span>{" "}
            {t("of")} <span className="font-medium">{total}</span>{" "}
            {t("results")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={ButtonVariant.Outline}
            size={ButtonSize.Sm}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={!hasPreviousPage}
          >
            <CaretLeftIcon className="w-4 h-4" />
            {t("previous")}
          </Button>
          <Button
            variant={ButtonVariant.Outline}
            size={ButtonSize.Sm}
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            {t("next")}
            <CaretRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
