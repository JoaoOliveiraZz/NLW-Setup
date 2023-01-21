import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const avaliableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
]


export function NewHabitForm() {

    const [title, setTitle] = useState();
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function handleToggleWeekDay(weekDay: number) {

        if (weekDays.includes(weekDay)) {
            const removedOndeWeekDays = weekDays.filter(day => day != weekDay);

            setWeekDays(removedOndeWeekDays)
        } else {
            const weekDaysAdd = [...weekDays, weekDay]

            setWeekDays(weekDaysAdd)
        }

    }

    async function createNewHabit(event: FormEvent){
        event.preventDefault()

        if( !title || !weekDays ){
            return
        }else{
            await api.post('habits', {
                title,
                weekDays
            })
        }

        setTitle('');
        setWeekDays([])
        alert('Hábito criado com sucesso!')
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6 ">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>
            <input
                type="text"
                id="title"
                placeholder="Exercícios, Dormir bem, saúde, etc..."
                autoFocus
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-withe placeholder:text-zinc-400"
                value={title}
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="mt-3 flex flex-col gap-2" >
                {
                    avaliableWeekDays.map((avaliableWeekDay, index) => {
                        return (
                            <Checkbox.Root
                                key={avaliableWeekDay}
                                className="flex items-center gap-3 group"
                                checked = { weekDays.includes(index) }
                                onCheckedChange={ () => handleToggleWeekDay(index) }
                            >
                                <div
                                    className="h-8 rounded-lg w-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
                                        group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500
                                    ">
                                    <Checkbox.Indicator >
                                        <Check
                                            size={20}
                                            className='text-white'
                                        />
                                    </Checkbox.Indicator>
                                </div>
                                <span className=" text-white leading-tight">
                                    {avaliableWeekDay}
                                </span>
                            </Checkbox.Root>
                        )
                    })
                }
            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight='bold' />
            </button>
        </form>
    )

}