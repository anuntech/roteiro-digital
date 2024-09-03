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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getTechnical } from "@/utils/get-technicals";
import { technical } from "../data/data";

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
    technical: null,
  });

  useEffect(() => {
    const companyName = getCompanyName();
    setFormData((state) => ({
      ...state,
      company_name: companyName || "",
    }));
  }, [formData.technical_name]);

  const [isTechnicalSelectOpen, setIsTechnicalSelectOpen] = useState(false);

  const [technicalInfo, setTechnicalInfo] = useState<any>();
  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { id, value } = event.target;
    console.log(id, value);
    const newValue = id === "created_at" ? value : value;
    setFormData((state) => ({
      ...state,
      [id]: newValue,
    }));
    console.log(formData);
  }

  useEffect(() => {
    getTechnical().then((res) => {
      setTechnicalInfo(res);
    });
  }, []);

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
        technical: parseInt(formData.technical as any),
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

  function getCompanyName() {
    const technicalName = formData.technical_name;

    const foundTechnical = technicalInfo?.find(
      (item: any) => item.name === technicalName,
    );

    return foundTechnical?.company_name;
  }

  function setTechnicalNumber(technicalName: string) {
    const foundTechnical = technicalInfo?.find(
      (item: any) => item.name === technicalName,
    );

    handleSelectChange("technical", foundTechnical.technical_number);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto hidden h-8 lg:flex">
          <Plus className="black mr-2 size-4" /> Adicionar
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
          <div>
            <Label htmlFor="created_at">Autorizada*</Label>
            <Input
              readOnly
              id="created_at"
              value={getCompanyName()}
              className="cursor-default"
            />
          </div>
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
              onOpenChange={() =>
                setIsTechnicalSelectOpen(!isTechnicalSelectOpen)
              }
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
                      {technicalInfo?.map((item: any) => (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={(currentValue) => {
                            handleSelectChange("technical_name", currentValue);
                            setIsTechnicalSelectOpen(false);
                            handleSelectChange(
                              "company_name",
                              item.company_name,
                            );
                            setTechnicalNumber(currentValue);
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
                          {item.name}
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
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Selecionar">Selecionar</SelectItem>
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
                    <SelectItem value="Autorização Especial">
                      Autorização Especial
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
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Selecionar">Selecionar</SelectItem>
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
                    <SelectItem value="Peça Descontinuada">
                      Peça Descontinuada
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
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Selecionar">Selecionar</SelectItem>
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
                    <SelectItem value="Sem Recebimento">
                      Sem Recebimento
                    </SelectItem>
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
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Selecionar">Selecionar</SelectItem>

                    <SelectItem value="À vista">À vista</SelectItem>
                    {[...Array(12)].map((_, index) => (
                      <SelectItem key={index} value={`${index + 1}x`}>
                        {index + 1}x
                      </SelectItem>
                    ))}
                    <SelectItem value="Duas ou mais (detalhar na observação)">
                      Duas ou mais (detalhar na observação)
                    </SelectItem>
                    <SelectItem value="Sem Recebimento">
                      Sem Recebimento
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
