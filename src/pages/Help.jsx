import { Card } from "../components/ui.jsx";

export default function Help() {
  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Help & Support</h1>
      <Card className="p-6 space-y-3 text-sm text-slate-600">
        <p>
          Need a hand with an application, transfer or document upload? Reach the EduGateway
          support desk any weekday.
        </p>
        <div className="pt-2 border-t border-slate-100">
          <div className="text-slate-800 font-medium">Email</div>
          <div>support@edugateway.example</div>
        </div>
        <div>
          <div className="text-slate-800 font-medium">Phone</div>
          <div>0800 555 0134</div>
        </div>
      </Card>
    </div>
  );
}