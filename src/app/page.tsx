"use client"

// Dependencies
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";

// Internal components
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DateTimePicker } from "./_components/datetime-picker";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { randomUUID } from "crypto";

export default function Home() {
  
  const form = useForm();

  const handleSubmit = form.handleSubmit((data) => {
    toast({
      title: 'Formulário enviado',
      description: `Data informada: ${format(data.date, "dd/MM/yyyy HH:mm")}`
    });
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormField 
            name="date"
            control={form.control}
            render={() => (
              <FormItem>
                  <span>Data e hora</span>
                  <FormControl>
                    <DateTimePicker
                      id={`form-date-field`}
                      fieldName="date"
                      hookForm={form}
                      locale={ptBR}
                      placeholder="Selecione uma data"
                    />
                  </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end py-2">
            <Button type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
