/** Real host + three browser players, using deliberately scripted sample answers. */
export async function captureAfterhours(page, _ctx, browser) {
  const base = process.env.AFTERHOURS_CAPTURE_ORIGIN || 'https://afterhours-aj8uppal.fly.dev';
  const contexts = [];
  const cleanup = async () => {
    try {
      const end = page.getByRole('button', { name: 'End room', exact: true });
      if (await end.count()) {
        await end.click();
        await page.getByRole('dialog').getByRole('button', { name: 'End room' }).click();
      }
    } finally {
      await Promise.allSettled(contexts.map((context) => context.close()));
    }
  };
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Host a game' }).click();
    await page.getByText('Add your own prompts', { exact: true }).click();
    await page
      .locator('#custom-prompts')
      .fill('Your sofa has reviewed you online. What is the headline of its one-star review?');
    await page.getByRole('button', { name: 'Create room' }).click();
    await page.getByTestId('room-code').waitFor();
    const code = (await page.getByTestId('room-code').innerText()).trim();
    await page.getByRole('radio', { name: 'Pierre, French accent', exact: true }).click();
    await page.locator('input[value="french"]:checked').waitFor();
    const names = ['Morgan', 'Priya', 'Theo'];
    const answers = [
      'Sits like a landlord, pays nothing.',
      'Five cushions. Zero ambition.',
      'Would not seat again.',
    ];
    const phones = [];
    for (let index = 0; index < 3; index++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      contexts.push(context);
      const phone = await context.newPage();
      phones.push(phone);
      await phone.goto(`${base}/?room=${code}`);
      await phone.getByLabel('What should we call you?').fill(names[index]);
      await phone
        .getByRole('button', { name: /^Choose .* avatar$/ })
        .nth(index)
        .click();
      await phone.getByRole('button', { name: 'Join the party' }).click();
      await phone.getByText('Waiting for the host to start.', { exact: true }).waitFor();
    }
    await page.getByRole('button', { name: 'Start the game' }).click();
    for (let index = 0; index < 3; index++) {
      await phones[index].getByLabel('Your answer', { exact: true }).fill(answers[index]);
      await phones[index].getByRole('button', { name: 'Lock in answer' }).click();
    }
    await page.getByTestId('phase-voting').waitFor();
    for (let index = 0; index < 3; index++) {
      const target = index === 0 ? answers[1] : answers[0];
      await phones[index]
        .getByRole('button', { name: /^Answer \d+:/ })
        .filter({ hasText: target })
        .click();
      await phones[index].getByRole('button', { name: 'Cast vote' }).click();
    }
    await page.getByTestId('phase-reveal').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    return cleanup;
  } catch (error) {
    await cleanup();
    throw error;
  }
}
