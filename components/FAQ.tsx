import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"

export default function FAQ() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center mb-8">Häufig gestellte Fragen</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Wie funktioniert der LinkedIn Bio Generator?</AccordionTrigger>
          <AccordionContent>
            Unser KI-gestützter Generator erstellt professionelle LinkedIn-Beschreibungen basierend auf Ihren Eingaben. Geben Sie einfach Ihren Beruf oder Ihr Lieblingshobby ein, wählen Sie den gewünschten Stil, und unsere KI generiert passende Beschreibungen für Sie.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Welche Stile stehen zur Verfügung?</AccordionTrigger>
          <AccordionContent>
            Sie können zwischen drei verschiedenen Stilen wählen: Professionell, Locker und Humorvoll. Jeder Stil ist auf unterschiedliche Zielgruppen und Branchen zugeschnitten.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Wie kann ich meine generierte Beschreibung verwenden?</AccordionTrigger>
          <AccordionContent>
            Klicken Sie einfach auf eine der generierten Beschreibungen, um sie in Ihre Zwischenablage zu kopieren. Sie können die Beschreibung dann direkt in Ihr LinkedIn-Profil einfügen und bei Bedarf noch anpassen.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Ist der Generator kostenlos?</AccordionTrigger>
          <AccordionContent>
            Ja, der LinkedIn Bio Generator ist komplett kostenlos. Sie können so viele Beschreibungen generieren, wie Sie möchten.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 