const fs = require('fs');

const files = [
  'src/services/group.service.ts',
  'src/services/issue.service.ts',
  'src/services/project.service.ts',
  'src/services/upload.service.ts',
  'src/services/workspace.service.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace apiClient with apiFetch imports
  content = content.replace(/import \{ apiClient \} from "@\/lib\/axios";/g, 'import { apiFetch } from "@/lib/api-fetch";');

  // We have things like:
  // const response = await apiClient.get<BaseResponse<Workspace>>(
  //   `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
  // );
  // return response.data;

  // Let's use a simpler regex that handles newlines:
  content = content.replace(/const response = await apiClient\.get<([\s\S]*?)>\(\s*([\s\S]*?),\s*\{\s*params\s*\},?\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2, { params });');
  
  content = content.replace(/const response = await apiClient\.get<([\s\S]*?)>\(\s*([\s\S]*?)\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2);');

  content = content.replace(/const response = await apiClient\.post<([\s\S]*?)>\(\s*([\s\S]*?),\s*([\s\S]*?),\s*(\{[\s\S]*?\})\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2, { method: "POST", body: $3, ...$4 });');

  content = content.replace(/const response = await apiClient\.post<([\s\S]*?)>\(\s*([\s\S]*?),\s*([\s\S]*?)\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2, { method: "POST", body: $3 });');

  content = content.replace(/const response = await apiClient\.put<([\s\S]*?)>\(\s*([\s\S]*?),\s*([\s\S]*?)\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2, { method: "PUT", body: $3 });');

  content = content.replace(/const response = await apiClient\.delete<([\s\S]*?)>\(\s*([\s\S]*?)\s*\);\s*return response\.data;/g, 'return apiFetch<$1>($2, { method: "DELETE" });');

  // Also replace any remaining `apiClient` just in case some weird formatting missed it
  if (content.includes('apiClient')) {
      console.log('Missed some apiClient in ' + file);
  }

  fs.writeFileSync(file, content);
}
console.log("Done");
