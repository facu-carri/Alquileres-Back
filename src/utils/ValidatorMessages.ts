import { ValidationArguments, ValidationOptions } from "class-validator"

export enum ValidatorTypes {
    "IsEmail",
    "isNotEmpty",
    "IsString",
    "MinLength",
    "IsNumber",
    "IsPhoneNumber",
    "IsEnum",
    "IsAlphaNumeric"
}

const messages = {
    [ValidatorTypes.IsEmail]: "Mail invalido",
    [ValidatorTypes.isNotEmpty]: "El parametro '${p}' no debe ser nulo",
    [ValidatorTypes.IsString]: "El parametro '${p}' debe ser un string",
    [ValidatorTypes.MinLength]: "El parametro '${p}' debe ser mayor o igual a ${0} caracteres",
    [ValidatorTypes.IsPhoneNumber]: "Numero telefono invalido",
    [ValidatorTypes.IsNumber]: "El parametro '${p}' debe ser un numero",
    [ValidatorTypes.IsEnum]: "El parametro '${p}' debe ser uno de: ${0}",
    [ValidatorTypes.IsAlphaNumeric]: "El parametro '${p}' debe ser alfanumerico"
}

function processArguments(type: ValidatorTypes, validationArguments: ValidationArguments): string {
    const { constraints, property, object } = validationArguments
    let ret = messages[type]

    if (type === ValidatorTypes.IsEnum && constraints?.[0]) {
        const enumObj = constraints[0];
        const enumValues = Object.values(enumObj).filter(v => typeof v === 'string').join(', ');
        ret = ret.replaceAll('${0}', enumValues);
    }

    if (ret.includes('${0}') && constraints.length > 0) {
        constraints.forEach((value, index) => ret = String(ret).replaceAll("${" + index + "}", value))
    }
    if (ret.includes('${p}') && property) {
        ret = ret.replaceAll('${p}', property)
    }
    if (ret.includes('${v}') && property && object[property]) {
        ret = ret.replaceAll('${v}', object[property])   
    }
    return ret
}

export function validationMessage(type: ValidatorTypes): ValidationOptions {
    return {
        message: processArguments.bind(null, type)
    }
}