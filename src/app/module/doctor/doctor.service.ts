import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    })

    // const query = new QueryBuilder().paginate().search().filter();
    return doctors
}
export const DoctorService = {
    getAllDoctors,
}