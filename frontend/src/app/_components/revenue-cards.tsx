import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckBig, DollarSign, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

export interface TotalValuesProps {
  totalReceivedValue: number;
  totalCard: number;
  totalCash: number;
  totalPix: number;
  totalOthers: number;
  totalOpportunities: number;
  totalApproved: number;
  loading: boolean;
  handleMethodFilterChange: (method: string) => Promise<void>;
}

export function RevenueCards({
  totalReceivedValue,
  totalCard,
  totalCash,
  totalPix,
  totalOthers,
  totalOpportunities,
  totalApproved,
  loading,
  handleMethodFilterChange,
}: TotalValuesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Total recebido
          </CardTitle>
          <DollarSign className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalReceivedValue)}
            </div>
          )}
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer"
        onClick={async () => await handleMethodFilterChange("Cartão")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Cartão
          </CardTitle>
          <DollarSign className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalCard)}
            </div>
          )}
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer"
        onClick={async () => await handleMethodFilterChange("Dinheiro")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Dinheiro
          </CardTitle>
          <DollarSign className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalCash)}
            </div>
          )}
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer"
        onClick={async () => await handleMethodFilterChange("Pix")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Pix
          </CardTitle>
          <DollarSign className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(totalPix)}</div>
          )}
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer"
        onClick={async () => await handleMethodFilterChange("Outros")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Outros
          </CardTitle>
          <DollarSign className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalOthers)}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Oportunidade
          </CardTitle>
          <Lightbulb className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOpportunities)}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            Aprovado
          </CardTitle>
          <CircleCheckBig className="size-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalApproved)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
