interface Mailbox {
  name: string;
}

interface Email {
  id: string;
  threadId: string;
}

function sanitizeMailboxName(name: string): string {
  return name.replace(" ", "_");
}

export function makeEmailURL(mailbox: Mailbox, email: Email): string {
  const mailboxSegment = sanitizeMailboxName(mailbox.name);
  const emailSegment = `${email.threadId}.${email.id}`;

  return `https://app.fastmail.com/mail/${mailboxSegment}/${emailSegment}`;
}
