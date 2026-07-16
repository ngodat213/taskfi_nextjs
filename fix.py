import re
import os

files = [
  'src/services/group.service.ts',
  'src/services/issue.service.ts',
  'src/services/project.service.ts',
  'src/services/upload.service.ts',
  'src/services/workspace.service.ts'
]

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('import { apiClient } from "@/lib/axios";', 'import { apiFetch } from "@/lib/api-fetch";')

    def replacer(match):
        method = match.group(1)
        type_param = match.group(2)
        args_str = match.group(3).strip()
        if args_str.endswith(','): args_str = args_str[:-1].strip()
        
        # split args by comma, but be careful with nested commas (there are none in these files except maybe for config objects)
        # Actually, let's just use string parsing
        
        if method == 'get':
            if '{ params }' in args_str:
                url = args_str.replace(', { params }', '').strip()
                if url.endswith(','): url = url[:-1].strip()
                return f'return apiFetch<{type_param}>({url}, {{ params }});'
            else:
                return f'return apiFetch<{type_param}>({args_str});'
        elif method == 'delete':
            return f'return apiFetch<{type_param}>({args_str}, {{ method: "DELETE" }});'
        elif method in ['post', 'put']:
            # find first comma
            idx = args_str.find(',')
            url = args_str[:idx].strip()
            rest = args_str[idx+1:].strip()
            
            # check if there's a third config arg like `{ headers: ... }`
            # upload.service.ts has it: formData, { headers: ... }
            if method == 'post' and '{' in rest and 'formData' in rest:
                idx2 = rest.find(',')
                body = rest[:idx2].strip()
                config = rest[idx2+1:].strip()
                config = config[1:-1].strip() # remove { }
                return f'return apiFetch<{type_param}>({url}, {{ method: "{method.upper()}", body: {body}, {config} }});'
            else:
                body = rest
                if body.endswith(','): body = body[:-1].strip()
                return f'return apiFetch<{type_param}>({url}, {{ method: "{method.upper()}", body: {body} }});'

    # match "const response = await apiClient.METHOD<TYPE>(ARGS);" 
    # followed by "return response.data;"
    pattern = re.compile(r'const response = await apiClient\.(get|post|put|delete)<([^>]+)>\((.*?)\);\s*return response\.data;', re.DOTALL)
    
    content = pattern.sub(replacer, content)

    with open(file, 'w') as f:
        f.write(content)
        
print("Done")
