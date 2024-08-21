import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { technical } from "../data/data";
import { cn } from "@/lib/utils";

type FormDataFields = Partial<{
  created_at: string;
  order_id: string;
  technical_name: string;
  order_classification: string;
  service_order_status: string;
  payment_method: string;
  payment_condition: string;
  parts_value: number;
  labor_value: number;
  visit_fee: number;
  received_value: number;
  advance_revenue: number;
  revenue_deduction: number;
  notes: string;
}>;

export const CreateOs = () => {
  const [formData, setFormData] = useState({
    created_at: new Date().toISOString().split("T")[0],
    technical_name: "",
    company_name: "",
    order_classification: "",
    service_order_status: "",
    payment_method: "Selecionar",
    payment_condition: "Selecionar",
    parts_value: "0",
    labor_value: "0",
    visit_fee: "0",
    received_value: "0",
    advance_revenue: "0",
    revenue_deduction: "0",
    order_id: "",
    notes: "",
  });

  const [isTechnicalSelectOpen, setIsTechnicalSelectOpen] = useState(false);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { id, value } = event.target;
    const newValue = id === "created_at" ? value : value;
    setFormData((state) => ({
      ...state,
      [id]: newValue,
    }));
  }

  async function handleUpdateRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const numberFields = {
        parts_value: parseFloat(formData.parts_value.replace(",", ".")),
        labor_value: parseFloat(
          (formData.labor_value as any).replace(",", "."),
        ),
        visit_fee: parseFloat((formData.visit_fee as any).replace(",", ".")),
        received_value: parseFloat(
          (formData.received_value as any).replace(",", "."),
        ),
        advance_revenue: parseFloat(
          (formData.advance_revenue as any).replace(",", "."),
        ),
        revenue_deduction: parseFloat(
          (formData.revenue_deduction as any).replace(",", "."),
        ),
      };
      const response = await api.post(`/digital-scripts`, {
        ...formData,
        ...numberFields,
      });

      if (response.status >= 200) {
        toast.message("Sucesso", {
          description: "Ordem de serviço criada com sucesso!",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.message("Erro!", {
        description: "Preencha todos os campos obrigatórios!",
      });
    }
  }

  function handleSelectChange(id: string, value: string) {
    setFormData((state) => ({
      ...state,
      [id]: value,
    }));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 px-2 lg:px-3">
          <Plus className="size-4 text-zinc-950" /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Isso alterará permanentemente essas
            informações da tabela.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateRow} className="space-y-4">
          <div className="flex gap-3">
            <div>
              <Label htmlFor="created_at">Visita*</Label>
              <Input
                id="created_at"
                type="date"
                value={formData.created_at}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="order_id">Serviço*</Label>
              <Input
                id="order_id"
                value={formData.order_id}
                className="read-only:focus-visible:ring-0"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="technician">Técnico*</Label>
            <Popover
              open={isTechnicalSelectOpen}
              onOpenChange={setIsTechnicalSelectOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {formData.technical_name || "Selecionar técnico..."}
                  <ChevronsUpDown className="ml-2 size-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar técnico..." />
                  <CommandEmpty>Técnico não encontrado.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {technical.map((item) => (
                        <CommandItem
                          key={item.label}
                          value={item.label}
                          onSelect={(currentValue) => {
                            handleSelectChange("technical_name", currentValue);
                            setIsTechnicalSelectOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              formData.technical_name === item.label
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="order_classification">Classificação*</Label>
              <Select
                value={formData.order_classification}
                onValueChange={(value) =>
                  handleSelectChange("order_classification", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Em Garantia">Em Garantia</SelectItem>
                    <SelectItem value="Fora de Garantia">
                      Fora de Garantia
                    </SelectItem>
                    <SelectItem value="Captação Externa">
                      Captação Externa
                    </SelectItem>
                    <SelectItem value="Garantia de Serviço">
                      Garantia de Serviço
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="service_order_status">Status do serviço*</Label>
              <Select
                value={formData.service_order_status}
                onValueChange={(value) =>
                  handleSelectChange("service_order_status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Falta/Voltar com Peça">
                      Falta/Voltar com Peça
                    </SelectItem>
                    <SelectItem value="Consumidor Não Aceita Reparo">
                      Consumidor Não Aceita Reparo
                    </SelectItem>
                    <SelectItem value="Serviço Executado">
                      Serviço Executado
                    </SelectItem>
                    <SelectItem value="Cancelamento da Solicitação pelo Consumidor">
                      Cancelamento da Solicitação pelo Consumidor
                    </SelectItem>
                    <SelectItem value="Consumidor Ausente">
                      Consumidor Ausente
                    </SelectItem>
                    <SelectItem value="Instrução de Uso Sem Defeito">
                      Instrução de Uso Sem Defeito
                    </SelectItem>
                    <SelectItem value="Aguardando Aprovação do Consumidor">
                      Aguardando Aprovação do Consumidor
                    </SelectItem>
                    <SelectItem value="Local Inadequado">
                      Local Inadequado
                    </SelectItem>
                    <SelectItem value="Reagendado">Reagendado</SelectItem>
                    <SelectItem value="Oficina - Entrega de Produto">
                      Oficina - Entrega de Produto
                    </SelectItem>
                    <SelectItem value="Oficina - Aguardando Retirada">
                      Oficina - Aguardando Retirada
                    </SelectItem>
                    <SelectItem value="Passar Orçamento">
                      Passar Orçamento
                    </SelectItem>
                    <SelectItem value="Endereço Não Localizado">
                      Endereço Não Localizado
                    </SelectItem>
                    <SelectItem value="Orçamento Não Aprovado">
                      Orçamento Não Aprovado
                    </SelectItem>
                    <SelectItem value="Produto/Peça Retirada da Oficina">
                      Produto/Peça Retirada da Oficina
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="payment_method">Forma de pagamento</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) =>
                  handleSelectChange("payment_method", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Crédito">Crédito</SelectItem>
                    <SelectItem value="Débito">Débito</SelectItem>
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Duas ou Mais Formas">
                      Duas ou Mais Formas
                    </SelectItem>
                    <SelectItem value="Pendente de Recebimento">
                      Pendente de Recebimento
                    </SelectItem>
                    <SelectItem value="Depósito em Conta">
                      Depósito em Conta
                    </SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="payment_condition">Parcela</Label>
              <Select
                value={formData.payment_condition}
                onValueChange={(value) =>
                  handleSelectChange("payment_condition", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="À vista">À vista</SelectItem>
                    {[...Array(12)].map((_, index) => (
                      <SelectItem key={index} value={`${index + 1}x`}>
                        {index + 1}x
                      </SelectItem>
                    ))}
                    <SelectItem value="Duas ou mais (detalhar na observação)">
                      Duas ou mais (detalhar na observação)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <Label htmlFor="parts_value">Peças</Label>
              <Input
                id="parts_value"
                value={formData.parts_value}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="labor_value">Mão de Obra</Label>
              <Input
                id="labor_value"
                value={formData.labor_value}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="visit_fee">Taxa</Label>
              <Input
                id="visit_fee"
                value={formData.visit_fee}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <Label htmlFor="revenue_deduction">Abatimento</Label>
              <Input
                id="revenue_deduction"
                value={formData.revenue_deduction}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="advance_revenue">Adiantamento</Label>
              <Input
                id="advance_revenue"
                value={formData.advance_revenue}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="received_value">Recebido</Label>
              <Input
                id="received_value"
                value={formData.received_value}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Criar ordem de serviço</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
