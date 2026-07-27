import { StudentTaskItem } from '../types';

/**
 * Generates a direct Google Calendar web link for instant 1-click addition
 */
export function buildGoogleCalendarUrl(task: StudentTaskItem, subjectName?: string): string {
  const title = encodeURIComponent(`[Estudei] ${task.type.toUpperCase()}: ${task.title} (${subjectName || 'Escola'})`);
  
  // Format start & end date
  let dateStr = task.date.replace(/-/g, '');
  let startIso = `${dateStr}T090000Z`;
  let endIso = `${dateStr}T100000Z`;

  if (task.time) {
    const cleanTime = task.time.replace(':', '');
    startIso = `${dateStr}T${cleanTime}00Z`;
    // Add 1 hour duration
    const hour = parseInt(task.time.split(':')[0], 10) + 1;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    endIso = `${dateStr}T${hourStr}${task.time.split(':')[1]}00Z`;
  }

  const details = encodeURIComponent(
    `Compromisso do Ensino Médio cadastrado pelo Estudei & Passei.\n\nMatéria: ${subjectName || 'Geral'}\nTipo: ${task.type}\nPrioridade: ${task.priority}\nNotas: ${task.notes || 'Nenhuma nota adicional'}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=Escola`;
}

/**
 * Creates an event in primary Google Calendar using Google Calendar REST API
 */
export async function createGoogleCalendarApiEvent(
  task: StudentTaskItem,
  subjectName: string,
  accessToken: string
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const startTime = task.time ? `${task.date}T${task.time}:00` : `${task.date}T09:00:00`;
    // 1 hour later
    const endHour = task.time ? parseInt(task.time.split(':')[0], 10) + 1 : 10;
    const endHourStr = endHour < 10 ? `0${endHour}` : `${endHour}`;
    const endTime = task.time ? `${task.date}T${endHourStr}:${task.time.split(':')[1]}:00` : `${task.date}T10:00:00`;

    const eventPayload = {
      summary: `[Estudei] ${task.type.toUpperCase()}: ${task.title}`,
      description: `MÁTERIA: ${subjectName}\nPRIORIDADE: ${task.priority.toUpperCase()}\n\nNotas do Aluno: ${task.notes || 'Sem observações'}\n\nCadastrado via Estudei & Passei Ensino Médio.`,
      start: {
        dateTime: `${startTime}-03:00`, // Timezone Brasilia
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: `${endTime}-03:00`,
        timeZone: 'America/Sao_Paulo'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 }, // 1 dia antes
          { method: 'popup', minutes: 120 }    // 2 horas antes
        ]
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    });

    if (!response.ok) {
      const errJson = await response.json();
      throw new Error(errJson?.error?.message || 'Erro ao sincronizar com API do Google Calendar');
    }

    const data = await response.json();
    return { success: true, eventId: data.id };
  } catch (err: any) {
    console.error('Falha ao criar evento no Google Calendar API:', err);
    return { success: false, error: err.message };
  }
}
