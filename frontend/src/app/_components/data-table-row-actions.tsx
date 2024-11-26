/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import { useRouter } from 'next/navigation'
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DigitalScript } from "./columns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { technical } from "../data/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getTechnical } from "@/utils/get-technicals";

dayjs.extend(customParseFormat);

interface DataTableRowActionsProps {
  row: DigitalScript;
}

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
  technical: number;
}>;

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const router = useRouter()
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);

  const [technicalInfo, setTechnicalInfo] = useState<any>();

  useEffect(() => {
    getTechnical().then((res) => {
      setTechnicalInfo(res);
    });
  }, []);

  const [isTechnicalSelectOpen, setIsTechnicalSelectOpen] = useState(false);

  const [formData, setFormData] = useState({
    created_at: dayjs(row.created_at, "DD-MM-YYYY").format("YYYY-MM-DD"),
    order_id: row.order_id,
    technical_name: row.technical_name,
    company_name: row.company_name,
    order_classification: row.order_classification,
    service_order_status: row.service_order_status,
    payment_method: row.payment_method,
    payment_condition: row.payment_condition,
    parts_value: row.parts_value.toString(),
    labor_value: row.labor_value.toString(),
    visit_fee: row.visit_fee.toString(),
    received_value: row.received_value.toString(),
    advance_revenue: row.advance_revenue.toString(),
    revenue_deduction: row.revenue_deduction.toString(),
    payment_receipt: row.payment_receipt.toString(),
    notes: row.notes,
    technical: row.technical,
  });

  useEffect(() => {
    setFormData({
      created_at: dayjs(row.created_at, "DD-MM-YYYY").format("YYYY-MM-DD"),
      order_id: row.order_id,
      technical_name: row.technical_name,
      company_name: row.company_name,
      order_classification: row.order_classification,
      service_order_status: row.service_order_status,
      payment_method: row.payment_method,
      payment_condition: row.payment_condition,
      parts_value: row.parts_value.toString(),
      labor_value: row.labor_value.toString(),
      visit_fee: row.visit_fee.toString(),
      received_value: row.received_value.toString(),
      advance_revenue: row.advance_revenue.toString(),
      revenue_deduction: row.revenue_deduction.toString(),
      payment_receipt: row.payment_receipt.toString(),
      notes: row.notes,
      technical: row.technical,
    });
  }, [row]);

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

  function handleSelectChange(id: string, value: string) {
    setFormData((state) => ({
      ...state,
      [id]: value,
    }));
  }

  const [password, setPassword] = useState("");
  async function handleDeleteRow(id: string) {
    try {
      const response = await api.delete(`/digital-scripts/${id}`, {
        params: { password },
      });
      setAlertDialogOpen(false);
      // router.refresh()
      window.location.reload();

      if (response.status === 200) {
        toast.message("Sucesso", {
          description: "Roteiro deletado com sucesso!",
        });
      }
    } catch (error) {
      console.log(error);
      toast.message("Erro!", {
        description: "Falha ao deletar!",
      });
    }
  }

  function setTechnicalNumber(technicalName: string) {
    const foundTechnical = technicalInfo?.find(
      (item: any) => item.name === technicalName,
    );

    console.log(foundTechnical?.technical);

    handleSelectChange("technical", foundTechnical.technical);
  }

  async function handleUpdateRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      console.log(formData);
      const numberFields = {
        parts_value: parseFloat(
          (formData.parts_value || "0").replace(",", "."),
        ),
        labor_value: parseFloat(
          (formData.labor_value || "0").replace(",", "."),
        ),
        visit_fee: parseFloat((formData.visit_fee || "0").replace(",", ".")),
        received_value: parseFloat(
          (formData.received_value || "0").replace(",", "."),
        ),
        advance_revenue: parseFloat(
          (formData.advance_revenue || "0").replace(",", "."),
        ),
        revenue_deduction: parseFloat(
          (formData.revenue_deduction || "0").replace(",", "."),
        ),
        technical: parseInt(formData.technical as any),
      };
      const response = await api.patch(`/digital-scripts/${row.id}`, {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
            <Pencil className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setAlertDialogOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Isso alterará permanentemente
              essas informações da tabela.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRow} className="space-y-4">
            <div className="flex gap-3">
              <div>
                <Label htmlFor="created_at">Visita</Label>
                <Input
                  id="created_at"
                  type="date"
                  value={formData.created_at}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="order_id">Serviço</Label>
                <Input
                  id="order_id"
                  value={formData.order_id}
                  readOnly
                  className="read-only:focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="technician">Técnico</Label>
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
                        {technicalInfo?.map((item: any) => (
                          <CommandItem
                            key={item.id}
                            value={item.name}
                            onSelect={(currentValue) => {
                              handleSelectChange(
                                "technical_name",
                                currentValue,
                              );
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
                <Label htmlFor="order_classification">Classificação</Label>
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
                      <SelectItem value="Garantia de Serviço">
                        Garantia de Serviço
                      </SelectItem>
                      <SelectItem value="Autorização Especial">
                        Autorização Especial
                      </SelectItem>
                      <SelectItem value="Captação Externa">
                        Captação Externa
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="service_order_status">Status do serviço</Label>
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
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="flex flex-col items-start">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente
              essa informação da tabela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex w-full items-center justify-between">
            <Input
              className="w-36"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <AlertDialogFooter className="flex">
              <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => handleDeleteRow(row.id)}
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
