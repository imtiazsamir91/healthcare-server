import e from "express";
import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
//import { Speciality } from "../../../../generated/prisma/client";
//import { prisma } from "../../prisma";

const createSpecialty = async (payload: Speciality): Promise<Speciality> => {
    const specialty = await prisma.speciality.create({
        data: payload,
    });
    return specialty;
}

const getAllSpecialty = async (): Promise<Speciality[]> => {
    const specialties = await prisma.speciality.findMany();
    return specialties;
}   
const deleteSpecialty = async (id: string): Promise<Speciality> => {
    const specialty = await prisma.speciality.delete({
        where: { id },
    });
    return specialty;
}

export const SpecialtyService = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty
}