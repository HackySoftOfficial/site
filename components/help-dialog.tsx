"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Help Center</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start a new chat?</AccordionTrigger>
              <AccordionContent>
                Click the "New Chat" button in the sidebar or start typing in the message box at the bottom of the screen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I upload images?</AccordionTrigger>
              <AccordionContent>
                Yes! Click the image icon next to the message input to upload an image. The AI can analyze and discuss the image with you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I access my chat history?</AccordionTrigger>
              <AccordionContent>
                Your chat history is displayed in the sidebar, organized by date. Click on any previous chat to continue the conversation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What AI models are available?</AccordionTrigger>
              <AccordionContent>
                You can choose between different AI models in the Settings dialog. Each model has different capabilities and response styles.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
} 