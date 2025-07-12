import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>About InfoVault</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="text-white w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">InfoVault</h3>
            <p className="text-slate-600">Personal Repository Manager</p>
            <p className="text-sm text-slate-500 mt-2">Version 1.0.0</p>
          </div>
          
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              InfoVault is a powerful personal repository manager designed to help you organize 
              and manage all your important digital assets in one place.
            </p>
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Project-based organization</li>
              <li>Support for multiple file types</li>
              <li>Advanced search and filtering</li>
              <li>Tag-based categorization</li>
              <li>Thumbnail previews</li>
              <li>Export/Import functionality</li>
              <li>Local storage for privacy</li>
              <li>Sort by name and date</li>
              <li>Inspirational quotes</li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Privacy First:</strong> All your data is stored locally on your device. 
              No cloud sync, no external servers, complete privacy.
            </p>
          </div>
          
          <div className="text-center pt-4">
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
