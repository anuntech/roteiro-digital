"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGlobalOrderStatusContext } from "@/app/context/os-classification-stats";

const chartConfig = {
  quantity: {
    label: "Quantity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type dataInput = {
  value: string;
  quantity: number;
};

export function BarChartComponent({
  className,
  handleOrderStatusFilterChange,
}: {
  className: string;
  handleOrderStatusFilterChange: (orderStatus: string) => void;
}) {
  const { orderStatus } = useGlobalOrderStatusContext();

  const filterToRemoveSomeValue = (item: dataInput) =>
    !["Serviço Executado", "Instrução de Uso Sem Defeito"].includes(item.value);
  const initialDataWithoutSomeValues = orderStatus.filter(
    filterToRemoveSomeValue,
  );

  const tickFormatter = (value: string) => {
    const dataUsing = initialDataWithoutSomeValues;
    if (dataUsing.length <= 4) {
      return value.length > 20 ? value.slice(0, 20) + "..." : value;
    }

    if (dataUsing.length >= 4 && dataUsing.length <= 6) {
      return value.length > 17 ? value.slice(0, 17) + "..." : value;
    }

    if (dataUsing.length >= 6 && dataUsing.length <= 7) {
      return value.length > 13 ? value.slice(0, 13) + "..." : value;
    }

    if (dataUsing.length >= 7 && dataUsing.length <= 15) {
      return value.length > 6 ? value.slice(0, 6) + "..." : value;
    }

    return value.slice(0, 4) + "...";
  };

  const unproductiveSum = (orderStatus as any).reduce(
    (accumulator: any, current: any) => {
      if (current.value === "Serviço Executado") return accumulator;
      return accumulator + Number(current.quantity);
    },
    0,
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Motivos de improdutividades</CardTitle>
        <CardDescription>
          {unproductiveSum} serviços com visita improdutiva
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={initialDataWithoutSomeValues}
            width={500}
            margin={{
              top: 25,
              bottom: 15,
            }}
            onClick={(v) => {
              if (Object.keys(v).length === 0) return;
              handleOrderStatusFilterChange(v.activeLabel || "");
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="value"
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()} // Format numbers with commas
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              className="cursor-pointer"
              dataKey="quantity"
              fill="var(--bar-color)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
