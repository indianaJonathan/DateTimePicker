"use client"

// React
import React, { ComponentProps, useState } from "react";

// Dependencies
import { enUS } from "date-fns/locale";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Locale, addMonths, format, getDay, getDaysInMonth, subMonths } from "date-fns";

// External components
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

// Internal components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Internal LIB
import { cn } from "@/lib/utils";

interface DateTimePickerProps extends ComponentProps<'input'> {
    placeholder?: string;
    startDate?: Date;
    locale?: Locale;
    fieldName: string;
    hookForm: UseFormReturn<FieldValues, any, undefined>;
}

export function DateTimePicker({ placeholder = "Pick a date", locale = enUS, fieldName, hookForm }: DateTimePickerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const daysInMonth = getDaysInMonth(date);
  const monthStartWeekDay = getDay(new Date(date.getFullYear(), date.getMonth(), 1));
  const monthEndWeekDay = getDay(new Date(date.getFullYear(), date.getMonth() + 1, -1)) + 1;

  function handlePrevMonth() {
      setDate(subMonths(date, 1));
  }

  function handleNextMonth() {
      setDate(addMonths(date, 1));
  }

  function handleDateSelect(day: number, month: number, year: number) {
      setSelectedDay(day);
      setSelectedMonth(month);
      setSelectedYear(year);
  }

  function handleHourChange(hour: number) {
    if (!hour) return setSelectedHour(0);
    if (hour > 23) return toast({
      title: 'Erro',
      description: 'Você não pode inserir mais que 23 horas'
    });
    if (hour.toString().length > 2) return;
    setSelectedHour(hour);
  }

  function handleMinuteChange(minute: number) {
    if (!minute) return setSelectedMinute(0);
    if (minute > 59) return toast({
      title: 'Erro',
      description: 'Você não pode inserir mais que 59 minutos'
    });
    if (minute.toString().length > 2) return;
    setSelectedMinute(minute);
  }

  return (
      <div className="w-full">
          <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger>
                  <div className='border border-border rounded-md flex items-center gap-2 px-2 py-1'>
                      <CalendarIcon className='size-4' />
                      <span className='text-sm placeholder:font-semibold'>{selectedDate ? format(selectedDate, "dd/MM/yyyy HH:mm") : placeholder}</span>
                  </div>
              </PopoverTrigger>
              <PopoverContent>
                  <div className='flex items-center py-2 border-b border-border'>
                      <Button variant="outline" type="button" onClick={handlePrevMonth}>
                          <ChevronLeftIcon className='size-3'/>
                      </Button>
                      <div className='flex-1 flex flex-col gap-1 items-center justify-center'>
                          <span className='text-center text-xs'>
                              {format(date ? date : new Date(), "yyyy", { locale })}
                          </span>
                          <span className='text-center text-sm font-semibold uppercase'>
                              {format(date ? date : new Date(), "MMMM", { locale })}
                          </span>
                      </div>
                      <Button variant="outline" type="button" onClick={handleNextMonth}>
                          <ChevronRightIcon className='size-3'/>
                      </Button>
                  </div>
                  <div className='grid grid-cols-7 gap-2 place-items-center py-2 border-b border-border'>
                      {Array.from({ length: 7 }).map((_, i) => {
                          return (
                          <div key={`week-day-${i}`} className='flex items-center justify-center w-full bg-muted-foreground px-2 py-1 rounded-t-md'>
                              <span className='text-xs text-white text-center'>
                              {format(new Date(2023, 9, i + 1), "E", { locale }).substring(0, 1).toLocaleUpperCase()}
                              </span>
                          </div>
                          );
                      })}
                      {Array.from({length: monthStartWeekDay}).map((_, i) => (
                          <div key={`empty-before-${i}`} className='size-8 rounded-full bg-muted flex items-center justify-center' />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => (
                          <div
                              key={`month-day-${i}`}
                              className={cn(
                                  'size-8 rounded-full border border-border flex items-center justify-center group transition-all duration-300',
                                  selectedDay === i + 1 && selectedMonth === date.getMonth()
                                  ? 'bg-red-500'
                                  : 'bg-secondary hover:bg-primary'
                              )}
                              onClick={() => handleDateSelect(i + 1, date.getMonth(), date.getFullYear())}
                          >
                          <span className='text-xs select-none group-hover:text-secondary'>
                              {i + 1}
                          </span>
                          </div>
                      ))}
                      {Array.from({length: 6 - (monthEndWeekDay < 7 ? monthEndWeekDay : 0)}).map((_, i) => (
                          <div key={`empty-after-${i}`} className='size-8 rounded-full bg-muted flex items-center justify-center' />
                      ))}
                  </div>
                  <div className="flex items-center justify-center gap-1 border-b border-border py-2">
                    <Input
                      id="datetime-hour-input"
                      type="text"
                      inputMode="numeric"
                      value={selectedHour}
                      onChange={(e) => handleHourChange(parseInt(e.target.value))}
                      className="w-12 text-center"
                    />
                    <span>:</span>
                    <Input
                      id="datetime-minute-input"
                      type="text"
                      inputMode="numeric"
                      value={selectedMinute}
                      onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
                      className="w-12 text-center"
                    />
                  </div>
                  <div className='flex items-center justify-end py-2'>
                      <Button variant="link" size="sm" onClick={() => {
                        setSelectedDay(0);
                        setSelectedMonth(0);
                        setSelectedYear(0);
                        setSelectedHour(0);
                        setSelectedMinute(0);
                        setSelectedDate(undefined);
                      }}>
                        Limpar
                      </Button>
                      <Button size="sm" type='button' onClick={() => {
                        if (selectedDay == 0 && selectedMonth == 0 && selectedYear == 0) {
                          setSelectedDate(undefined);
                          hookForm.setValue(fieldName, "");
                          return;
                        }
                        const newDate = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute);
                        setSelectedDate(newDate);
                        hookForm.setValue(fieldName, format(newDate, "yyyy-MM-dd'T'HH:mm"));
                        setOpen(false);
                      }}>
                          Salvar
                      </Button>
                  </div>
              </PopoverContent>
          </Popover>
      </div>
  );
}
