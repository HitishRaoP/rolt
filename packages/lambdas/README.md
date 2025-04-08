## AWS Lambda Function (TypeScript)

This directory contains a Lambda function written in TypeScript, located under `src/{folder_name}`.

### 🧱 How to Write the Function

1. Create a folder under `src/` with your function name:

   ```
   src/yourFunctionName/
   ```

2. Inside that folder, create an `index.ts` file with the following basic structure:

   ```ts
   import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

   export const handler = async (
     event: APIGatewayProxyEvent
   ): Promise<APIGatewayProxyResult> => {
     return {
       statusCode: 200,
       body: JSON.stringify({ message: 'Hello from Lambda!' }),
     };
   };
   ```

3. This function handles API Gateway requests and returns a JSON response.

---

### 🛠 How to Build

From the `packages/lambdas` directory, run:

```bash
yarn build yourFunctionName
```

This compiles the TypeScript in `src/yourFunctionName` into `dist/yourFunctionName`.

---

### 📂 Folder Structure Example

```
packages/lambdas/
├── src/
│   └── yourFunctionName/
│       └── index.ts
├── tsconfig.json
└── package.json
```