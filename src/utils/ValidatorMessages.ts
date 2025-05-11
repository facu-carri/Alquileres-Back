import { ValidationArguments } from "class-validator"

export enum ValidatorTypes {
    "IsEmail",
    "isNotEmpty",
    "IsString",
    "MinLength"
}

const messages = {
    [ValidatorTypes.IsEmail]: "Mail invalido",
    [ValidatorTypes.isNotEmpty]: 'El nombre de usuario no debe ser nulo',
    [ValidatorTypes.IsString]: "El nombre de usuario debe ser un string",
    [ValidatorTypes.MinLength]: "La contrasenia debe ser mayor o igual a ${0} caracteres"
}

function processArguments(type: ValidatorTypes, validationArguments: ValidationArguments): string {
    const { constraints } = validationArguments
    let ret = messages[type]
    constraints.forEach((value, index) => ret = String(ret).replace("${" + index + "}", value))
    return ret
}

export function validationMessage(type: ValidatorTypes){
    return {
        message: processArguments.bind(null, type)
    }
}