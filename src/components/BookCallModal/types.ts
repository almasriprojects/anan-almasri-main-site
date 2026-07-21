export interface FormData {
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

export const INITIAL_FORM: FormData = {
  date: "",
  timeSlot: "",
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
};

export const WEBHOOK_URL = "https://n8n.ananalmasri.com/webhook/submit";
