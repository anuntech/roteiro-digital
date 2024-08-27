"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, PlusCircle } from "lucide-react";
import { api } from "@/lib/axios";

interface DataTableTechnicalFilterProps {
  options: {
    label: string;
    company: string;
  }[];
  selectedValues: string[];
  companyFilter: string[];
  setSelectedValues: Dispatch<SetStateAction<string[]>>;
  onChange: (technicians: string[]) => void;
}

export function DataTableTechnicalFilter({
  options,
  selectedValues,
  companyFilter,
  setSelectedValues,
  onChange,
}: DataTableTechnicalFilterProps) {
  function handleSelect(label: string) {
    const newSelectedValues = new Set(selectedValues);
    if (newSelectedValues.has(label)) {
      newSelectedValues.delete(label);
    } else {
      newSelectedValues.add(label);
    }
    setSelectedValues(Array.from(newSelectedValues));
    onChange(Array.from(newSelectedValues));
  }

  function handleClear() {
    setSelectedValues([]);
    onChange([]);
  }

  const [technicalOptions, setTechnicalOptions] = useState<string[]>([""]);

  useEffect(() => {
    api.get(`/digital-scripts/technical`).then((res) => {
      setTechnicalOptions(res.data);
    });
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 size-4" />
          Técnico
          {technicalOptions?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {technicalOptions.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {technicalOptions.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {technicalOptions.length} selecionados
                  </Badge>
                ) : (
                  technicalOptions?.map((option) => (
                    <Badge
                      variant="secondary"
                      key={option}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Autorizada" />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {technicalOptions?.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("size-4")} />
                    </div>
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
