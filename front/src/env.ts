/// <reference types="vite/client" />

const envs = {
  port: Number(import.meta.env.VITE_PORT),
  back: import.meta.env.VITE_BACK,
};

export function allEnv(env: string) {
  return findValueByKey(envs, env);
}

function findValueByKey(obj: any, key: string): any {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  }

  for (const k in obj) {
    if (typeof obj[k] === "object" && obj[k] !== null) {
      const result = findValueByKey(obj[k], key);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return null;
}
