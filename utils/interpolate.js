export function interpolate(permissions = [], context = {}) {
  //transform context permissions here
  const parsedPermissions = permissions.map((permission) => {
    return {
      ...permission,
      conditions:
        permission.conditions != null
          ? parseAndReplace(JSON.stringify(permission.conditions), context)
          : null,
    };
  });

  return parsedPermissions;
}

function parseAndReplace(jsonString, context) {
  return JSON.parse(jsonString, (key, value) => {
    if (typeof value === "string" && value.startsWith("${")) {
      const val = value.replace(/\${user\.(\w+)}/g, (match, p1) => {
        return context[p1] !== undefined ? context[p1] : match;
      });

      //convert id fields to int
      if (
        typeof val === "string" &&
        !!value.match(/\.[iI][dD]/g)?.length &&
        !isNaN(parseInt(val, 10))
      ) {
        return parseInt(val, 10);
      }

      return val;
    }
    return value;
  });
}
