import { Card, CardHeader, CardBody, Image } from "@heroui/react";

interface CustomCardProps {
  title: string;
  subtitle: string;
  tracks: string;
  image: string;
}

export default function CustomCard({ title, subtitle, tracks, image }: CustomCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{tracks}</p>
        <small className="text-default-500">{subtitle}</small>
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt={title}
          className="object-cover rounded-xl"
          src={image}
          width={270}
        />
      </CardBody>
    </Card>
  );
}
