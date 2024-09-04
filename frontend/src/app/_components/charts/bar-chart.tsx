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

  const top4 = initialDataWithoutSomeValues.slice(0, 4) as dataInput[];
  const othersSum = initialDataWithoutSomeValues
    .slice(4)
    .reduce((acc, curr) => acc + (curr as any).quantity, 0);
  top4.sort((a, b) => (b as any).quantity - (a as any).quantity);

  if (initialDataWithoutSomeValues.length > 4)
    top4.push({
      quantity: othersSum,
      value: "Outros",
    } as dataInput);

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
            data={top4}
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
              tickFormatter={(value: string) =>
                value.slice(0, 15) + (value.length > 15 ? "..." : "")
              }
              axisLine={false}
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
