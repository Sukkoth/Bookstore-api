import schema from "../prisma/json-schema/json-schema.json" assert { type: "json" };
import { AppError } from "../middleware/errorMiddleware.js";

const mainOperator = "AND";

export const prismaQueryGenerator = (filterArray, modelName) => {
  if (!filterArray || !modelName) {
    throw new AppError({
      message:
        "You need to provide both filterArray and modelName to parameter",
      statusCode: 400,
    });
  }

  let where = [];
  const model = schema.definitions[modelName];
  const properties = Object.keys(model.properties);

  filterArray.forEach((element) => {
    //for single items (no nested things)
    if (!element?.field || !element?.operator || !element?.value) {
      throw new AppError({
        message: `Make sure that your filter query includes all neccesary fields: field, operator and value: you provided: ${
          Object.keys(element)?.toString() || []
        }`,
      });
    }
    const field = properties.filter((key) => key === element.field);
    if (element.field.includes(".")) {
      const splittedArray = element.field.split(".");
      //field name would be the last item in the array, all the later items are relations
      const fieldName = splittedArray.pop(); //assign the last element as fieldName, the rest are relations

      //take all the elements in splitted Array
      //check if there is that relation

      let testerRelation = null;
      splittedArray.forEach((relation, index) => {
        if (!testerRelation) {
          if (
            model.properties[relation]?.$ref ||
            model.properties[relation]?.items?.$ref
          ) {
            const relationName =
              model.properties[relation]?.$ref?.split("/") ||
              model.properties[relation]?.items?.$ref?.split("/");
            testerRelation = relationName.at(-1);

            where.push({
              [relation]: {
                [fieldName]: {
                  [element.operator]: element.value,
                },
              },
            });
          } else {
            throw new AppError({
              message: `Nested: Not found relation for ${relation} on model ${modelName}`,
              statusCode: 400,
            });
          }
        } else {
          if (
            !Object.keys(
              schema.definitions[testerRelation].properties
            ).includes(relation)
          ) {
            throw new AppError({
              message: `Elsing: Not found relation for ${relation} on model ${testerRelation}`,
              statusCode: 400,
            });
          }

          //if this is the last item in the splittedArray, check it with then final field name,
          if (splittedArray.length - 1 === index) {
            console.log("LAST RELATION NAME", relation, testerRelation);
            const found = Object.keys(
              schema.definitions[testerRelation].properties
            ).includes(relation);
            // testerRelation = found;

            const result = createDeepObject(splittedArray, {
              [fieldName]: {
                [element.operator]: element.value,
              },
            });
            where = [result];
          }
        }
      });
      //add to the list
    } else {
      // * for simple queries
      if (field.length === 0) {
        throw new AppError({
          message: `There is no field named as ${element.field} on model ${modelName}`,
          statusCode: 400,
        });
      }
      let value;
      if (
        model.properties[element.field].type === "integer" &&
        !isNaN(parseInt(element.value))
      ) {
        value = parseInt(element.value);
      } else if (
        model.properties[element.field].type === "boolean" &&
        (element.value === "false" ||
          element.value === "true" ||
          typeof element.value === "boolean")
      ) {
        value = Boolean(value);
      }
      const single = {
        [properties.filter((key) => key === element.field)[0]]: {
          [element.operator]: element.value,
        },
      };
      where.push(single);
    }
  });

  return {
    where: {
      [mainOperator]: where,
    },
  };
};

function createDeepObject(keys, value) {
  if (!Array.isArray(keys) || keys.length === 0) {
    throw new Error("Keys must be a non-empty array");
  }
  // Start from the innermost object and work backwards
  return keys.reverse().reduce((acc, key) => {
    return { [key]: acc };
  }, value);
}
