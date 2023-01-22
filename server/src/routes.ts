import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { date } from "zod/lib";
import {prisma} from './lib/prisma'



export async function appRoutes(app: FastifyInstance){
    
    app.post('/habits', async(request) => {

        const createHabitBody = z.object({ //Falando pro z que request.body é um objeto 
            title: z.string(),  //Apontando que title é uma String
            weekDays: z.array(z.number()).min(0).max(6) //Dizendo que weekDays é um array de números que tem o mínimo 0 e máximo 6 (7 dias na semana)
        })
        

        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create(
            {
                data: {
                    title,
                    created_at: today,
                    weekDays: {
                        create: weekDays.map(weekDay => {
                            return {
                                week_day: weekDay,
                            }
                        })
                    }
                }
            }
        )

        

    });

    app.get('/day', async (request) => {

        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parseDate = dayjs(date).startOf('day')
        const weekDays = parseDate.get('day');

        const possibleHabtis = await prisma.habit.findMany(
            {
                where: {
                    created_at: {
                        lte: date
                    },
                    weekDays: {
                        some: {
                            week_day: weekDays,
                        }
                    }
                }
            }
        )

        const day = await prisma.day.findFirst({
            where:{
                date: parseDate.toDate()
            },
            include:{
                dayHabits: true
            }
        })

        const completedHabits = day ?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabtis,
            completedHabits
        }

    })

    app.patch('/habits/:id/toggle', async (request) => {


        const toggleHabitParms = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParms.parse(request.params);

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        })

        if(!day){
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }


        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            // Remover marcação
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            });
        }else{
            // Completar um hábto
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            });
        }

    })

    app.get('/summary', async () => {

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habbit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D

        `

        return summary;

    })

}