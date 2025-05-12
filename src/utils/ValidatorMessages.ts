import { ValidationArguments, ValidationOptions } from "class-validator"

export enum ValidatorTypes {
    "IsEmail",
    "isNotEmpty",
    "IsString",
    "MinLength",
    "IsPhoneNumber"
}

const messages = {
    [ValidatorTypes.IsEmail]: "Mail invalido",
    [ValidatorTypes.isNotEmpty]: 'El nombre de usuario no debe ser nulo',
    [ValidatorTypes.IsString]: "El nombre de usuario debe ser un string",
    [ValidatorTypes.MinLength]: "La contrasenia debe ser mayor o igual a ${0} caracteres",
    [ValidatorTypes.IsPhoneNumber]: "El numero telefono es invalido"
}

function processArguments(type: ValidatorTypes, validationArguments: ValidationArguments): string {
    const { constraints } = validationArguments
    let ret = messages[type]

    if (ret.includes('${0}') && constraints.length > 0) {
        constraints.forEach((value, index) => ret = String(ret).replace("${" + index + "}", value))
    }
    
    return ret
}

export function validationMessage(type: ValidatorTypes): ValidationOptions {
    return {
        message: processArguments.bind(null, type)
    }
}