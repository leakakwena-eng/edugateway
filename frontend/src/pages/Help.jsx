import { Clock, Mail, Phone } from "lucide-react";
import { Card, PageHeader } from "../components/ui.jsx";
import { HelpArt } from "../components/Illustrations.jsx";

const FAQ = [
  ["How do I apply?", "Add your learner under My Learners, then start a New Application and choose an open intake."],
  ["Which documents do I need?", "Each school lists its required documents when you choose an intake. PDF, JPG or PNG up to 5 MB."],
  ["What about transfers?", "If your learner is already enrolled, an application to a new school becomes a transfer automatically."],
];

export default function Help() {
  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="We're here to help" title="Help & Support" />
      <Card className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center mb-6">
        <HelpArt className="w-44 h-32 shrink-0" />
        <div className="flex-1 space-y-3 text-sm">
          <p className="text-stone-600">
            Need a hand with an application, transfer or document upload? Reach the EduGateway support desk any weekday.
          </p>
          <div className="flex items-center gap-2.5 text-stone-900 font-medium">
            <Mail size={16} className="text-brand-600" /> support@edugateway.example
          </div>
          <div className="flex items-center gap-2.5 text-stone-900 font-medium">
            <Phone size={16} className="text-brand-600" /> 0800 555 0134
          </div>
          <div className="flex items-center gap-2.5 text-stone-500">
            <Clock size={16} className="text-sun-500" /> Mon–Fri, 08:00–16:30
          </div>
        </div>
      </Card>
      <div className="space-y-3">
        {FAQ.map(([q, a], i) => (
          <Card key={q} style={{ "--i": i }} className="p-5 animate-fade-up stagger">
            <div className="font-semibold text-stone-900">{q}</div>
            <div className="text-sm text-stone-500 mt-1">{a}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
