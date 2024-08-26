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
import { TechnicalDigitalScript } from "./technical-data-table-columns";

dayjs.extend(customParseFormat);

interface DataTableRowActionsProps {
  row: TechnicalDigitalScript;
}

export function TechnicalDataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  // const router = useRouter()
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);

  const [technicalInfo, setTechnicalInfo] = useState<any>();

  useEffect(() => {
    getTechnical().then((res) => {
      setTechnicalInfo(res);
    });
  }, []);

  const [formData, setFormData] = useState({
    name: row.name,
    technical_number: row.technical_number,
    company_name: row.company_name,
  });

  useEffect(() => {
    setFormData({
      name: row.name,
      technical_number: row.technical_number,
      company_name: row.company_name,
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

  async function handleDeleteRow(id: string) {
    const response = await api.delete(`/technical/${id}`);
    setAlertDialogOpen(false);
    // router.refresh()
    window.location.reload();

    if (response.status === 200) {
      toast.message("Sucesso", {
        description: "Roteiro deletado com sucesso!",
      });
    }
  }

  async function handleUpdateRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await api.patch(`/technical/${row.id}`, formData);

      if (response.status >= 200) {
        toast.message("Sucesso", {
          description: "Ordem de serviço criada com sucesso!",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.message("Erro!", {
        description: "Identificador já existe!",
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
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="technical_number">Identificador</Label>
              <Input
                id="technical_number"
                value={formData.technical_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Autorizada</Label>
              <Input
                id="company_name"
                value={formData.company_name}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente
              essa informação da tabela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteRow(row.id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
