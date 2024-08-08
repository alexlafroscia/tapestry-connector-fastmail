import { getClient } from "./jam";
import { makeEmailURL } from "./mail";

async function verify() {
  try {
    const jam = getClient();
    const session = await jam.session;

    processVerification({
      baseUrl: session.apiUrl,
    });
  } catch (e) {
    processError(e);
  }
}

async function load() {
  const jam = getClient();
  const accountId = await jam.getPrimaryAccount();

  const [{ mailboxes }] = await jam.requestMany((r) => {
    const mailboxIds = r.Mailbox.query({
      accountId,
      filter: {
        name: "Inbox",
      },
      limit: 1,
    });

    const mailboxes = r.Mailbox.get({
      accountId,
      ids: mailboxIds.$ref("/ids"),
    });

    return { mailboxIds, mailboxes };
  });

  const [mailbox] = mailboxes.list;

  const [{ emails }] = await jam.requestMany((r) => {
    const emailIds = r.Email.query({
      accountId,
      filter: {
        inMailbox: mailbox.id,
      },
    });

    const emails = r.Email.get({
      accountId,
      ids: emailIds.$ref("/ids"),
      properties: ["id", "subject", "threadId", "receivedAt"],
    });

    return { emailIds, emails };
  });

  const items = emails.list.map((email) => {
    const item = Item.createWithUriDate(
      makeEmailURL(mailbox, email),
      new Date(email.receivedAt)
    );
    item.title = email.subject;

    return item;
  });

  processResults(items);
}
