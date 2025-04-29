import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validateDTO({ LoginDto, body }: any) {
  // Validar los datos usando class-validator
  const data = plainToInstance(LoginDto, body);
  validate(data).then((errors) => {
    if (errors.length > 0) {
      return {
        error: errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        })),
      };
    }
  });

  return data;
}
