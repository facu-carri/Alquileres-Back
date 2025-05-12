import { ValidationArguments } from "class-validator"

export enum ValidatorTypes {
    "IsEmail",
    "isNotEmpty",
    "IsString",
    "MinLength",
    "IsNumber"
}

const messages = {
    [ValidatorTypes.IsEmail]: "Mail invalido",
    [ValidatorTypes.isNotEmpty]: 'El valor no debe ser nulo',
    [ValidatorTypes.IsString]: "El valor tiene que ser un string",
    [ValidatorTypes.MinLength]: "La contraseña debe ser mayor o igual a ${0} caracteres",
    [ValidatorTypes.IsNumber]: "El valor debe ser un numero"
}

function processArguments(type: ValidatorTypes, validationArguments: ValidationArguments): string {
    const { constraints = [] } = validationArguments;
    let ret = messages[type]


    if (constraints && constraints.length > 0) {
        constraints.forEach((value, index) => { ret = String(ret).replace(`\${${index}}`, value);});
    }
    return ret
}

export function validationMessage(type: ValidatorTypes){
    return {
        message: processArguments.bind(null, type)
    }
}