// Demo data, generated relative to today so it always looks alive.
import { getState, update, addArea } from './store.js';
import { makeTask, makeProject, makeHabit, makeWorkout, makeExercise, makeWorkoutLog, makeEvent, makePerson, makeJournalEntry, nowISO } from './model.js';
import { todayKey, addDays, weekday } from './dates.js';
import { toast , undoToast } from './ui/components.js';

export function loadSample() {
  const state = getState();
  const today = todayKey();
  const area = (name) => state.areas.find((a) => a.name.toLowerCase() === name.toLowerCase()) || state.areas[0];
  const ts = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString();

  const work = area('Work'), proj = area('Projects'), home = area('Home'), personal = area('Personal'), fitness = area('Fitness'), social = area('Social');

  const pLaunch = makeProject({ name: 'Q4 product launch', areaId: work.id, description: 'Ship v2 to all customers by end of quarter. Owner: me. Weekly sync Thursdays.', dueDate: addDays(today, 45) });
  const pKitchen = makeProject({ name: 'Kitchen refresh', areaId: home.id, description: 'Repaint cabinets, new handles, replace the tap.', dueDate: addDays(today, 30) });
  const pPiano = makeProject({ name: 'Learn piano', areaId: personal.id, description: 'Goal: play Clair de Lune by spring.' });
  const pSide = makeProject({ name: 'Side project: recipe app', areaId: proj.id, description: 'Weekend build. Keep scope tiny.' });
  const pDone = makeProject({ name: 'Tax return', areaId: personal.id, status: 'done' });

  const tasks = [
    makeTask({ title: 'Prepare launch checklist', projectId: pLaunch.id, areaId: work.id, dueDate: today, priority: 3, status: 'doing' }),
    makeTask({ title: 'Review pricing page copy', projectId: pLaunch.id, areaId: work.id, dueDate: addDays(today, 1), priority: 2 }),
    makeTask({ title: 'Send weekly status update', areaId: work.id, dueDate: today, dueTime: '16:00', recurrence: { freq: 'weekly', interval: 1, days: [weekday(today)] } }),
    makeTask({ title: 'Book 1:1 with manager', areaId: work.id, dueDate: addDays(today, -2), priority: 1 }),
    makeTask({ title: 'Buy cabinet paint (2 tins, satin)', projectId: pKitchen.id, areaId: home.id, dueDate: addDays(today, 3), tags: ['errand'] }),
    makeTask({ title: 'Measure for new handles', projectId: pKitchen.id, areaId: home.id, status: 'done', completedAt: ts(1) }),
    makeTask({ title: 'Call plumber about the tap', projectId: pKitchen.id, areaId: home.id, dueDate: addDays(today, 5), priority: 2 }),
    makeTask({ title: 'Take out recycling', areaId: home.id, dueDate: today, recurrence: { freq: 'weekly', interval: 1, days: [weekday(today)] } }),
    makeTask({ title: 'Water the plants', areaId: home.id, dueDate: today, recurrence: { freq: 'daily', interval: 3 } }),
    makeTask({ title: 'Practice scales, 15 min', projectId: pPiano.id, areaId: personal.id, dueDate: today }),
    makeTask({ title: 'Find a teacher nearby', projectId: pPiano.id, areaId: personal.id, dueDate: addDays(today, 7) }),
    makeTask({ title: 'Sketch data model', projectId: pSide.id, areaId: proj.id, status: 'done', completedAt: ts(3) }),
    makeTask({ title: 'Set up repo + CI', projectId: pSide.id, areaId: proj.id, dueDate: addDays(today, 6) }),
    makeTask({ title: 'Renew passport', areaId: personal.id, dueDate: addDays(today, 20), priority: 2, notes: 'Check photo requirements first.' }),
    makeTask({ title: 'Book dentist', areaId: personal.id, dueDate: addDays(today, 2), tags: ['health'] }),
    makeTask({ title: 'Read 20 pages', areaId: personal.id, status: 'done', completedAt: ts(0) }),
    makeTask({ title: "Plan Sam's birthday", areaId: social.id, dueDate: addDays(today, 10) }),
    makeTask({ title: 'Someday: learn to sail', areaId: personal.id }),
  ];

  const habits = [
    makeHabit({ name: 'Morning routine', icon: '☀️', kind: 'routine', areaId: personal.id, schedule: { type: 'weekly', days: [1, 2, 3, 4, 5] }, timeOfDay: 'morning', notes: 'Stretch · water · 10 min plan · no phone before 8', createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Drink water', icon: '💧', areaId: fitness.id, schedule: { type: 'daily' }, target: 8, unit: 'glasses', createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Read 20 minutes', icon: '📚', areaId: personal.id, schedule: { type: 'daily' }, timeOfDay: 'evening', createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Meditate', icon: '🧘', areaId: personal.id, schedule: { type: 'daily' }, timeOfDay: 'morning', createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Piano practice', icon: '🎹', areaId: personal.id, schedule: { type: 'timesPerWeek', times: 4 }, createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Sunday reset', icon: '🧹', kind: 'routine', areaId: home.id, schedule: { type: 'weekly', days: [0] }, notes: 'Laundry · meal prep · tidy desk · plan the week', createdAt: ts(40), startDate: addDays(today, -40) }),
    makeHabit({ name: 'Inbox zero', icon: '📬', areaId: work.id, schedule: { type: 'weekly', days: [1, 2, 3, 4, 5] }, timeOfDay: 'afternoon', createdAt: ts(40), startDate: addDays(today, -40) }),
  ];
  const habitLogs = {};
  const seeded = (i) => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };
  habits.forEach((h, hi) => {
    habitLogs[h.id] = {};
    for (let d = 1; d <= 35; d++) {
      const key = addDays(today, -d);
      const r = seeded(hi * 100 + d);
      const p = hi === 1 ? 0.85 : hi === 4 ? 0.6 : 0.78;
      if (r < p) habitLogs[h.id][key] = h.target > 1 ? Math.max(1, Math.round(h.target * (0.6 + r * 0.5))) : 1;
    }
  });
  habitLogs[habits[0].id][today] = 1;
  habitLogs[habits[1].id][today] = 3;

  const workouts = [
    makeWorkout({ name: 'Push day', days: [1, 4], durationMin: 50, exercises: [makeExercise({ name: 'Bench press', sets: 4, reps: 8, weight: '60kg' }), makeExercise({ name: 'Overhead press', sets: 3, reps: 10, weight: '35kg' }), makeExercise({ name: 'Dips', sets: 3, reps: 12 }), makeExercise({ name: 'Lateral raises', sets: 3, reps: 15, weight: '8kg' })] }),
    makeWorkout({ name: 'Pull day', days: [2, 5], durationMin: 50, exercises: [makeExercise({ name: 'Deadlift', sets: 4, reps: 5, weight: '100kg' }), makeExercise({ name: 'Pull-ups', sets: 4, reps: 8 }), makeExercise({ name: 'Rows', sets: 3, reps: 10, weight: '50kg' }), makeExercise({ name: 'Curls', sets: 3, reps: 12, weight: '12kg' })] }),
    makeWorkout({ name: 'Legs', days: [3], durationMin: 55, exercises: [makeExercise({ name: 'Squat', sets: 4, reps: 6, weight: '80kg' }), makeExercise({ name: 'RDL', sets: 3, reps: 10, weight: '60kg' }), makeExercise({ name: 'Lunges', sets: 3, reps: 12 }), makeExercise({ name: 'Calf raises', sets: 4, reps: 15 })] }),
    makeWorkout({ name: 'Easy run', days: [6], durationMin: 35, exercises: [makeExercise({ name: '5k run', sets: 1, reps: 1, weight: '5 km' })] }),
  ];
  const workoutLogs = [];
  for (let d = 1; d <= 28; d++) {
    const key = addDays(today, -d);
    const wd = weekday(key);
    const w = workouts.find((x) => x.days.includes(wd));
    if (w && seeded(500 + d) < 0.8) workoutLogs.push(makeWorkoutLog({ workoutId: w.id, name: w.name, date: key, durationMin: w.durationMin + Math.round((seeded(700 + d) - 0.5) * 10), exercises: w.exercises.map((e) => ({ ...e, done: true })), rating: 3 + Math.round(seeded(900 + d) * 2), createdAt: ts(d) }));
  }

  const people = [
    makePerson({ name: 'Sam', emoji: '😎', group: 'Close friends', cadenceDays: 14, lastContact: addDays(today, -20), birthday: addDays(today, 12).replace(/^\d{4}/, '1992'), notes: 'Loves ramen. Training for a half marathon.' }),
    makePerson({ name: 'Priya', emoji: '🧑‍🎨', group: 'Close friends', cadenceDays: 21, lastContact: addDays(today, -5), notes: 'Ask about the gallery show.' }),
    makePerson({ name: 'Mum', emoji: '👩', group: 'Family', cadenceDays: 7, lastContact: addDays(today, -6) }),
    makePerson({ name: 'Dad', emoji: '👨', group: 'Family', cadenceDays: 7, lastContact: addDays(today, -9) }),
    makePerson({ name: 'Alex', emoji: '🙂', group: 'Work', cadenceDays: 30, lastContact: addDays(today, -40), notes: 'Former teammate, now at a startup.' }),
    makePerson({ name: 'Jordan', emoji: '🧗', group: 'Climbing', cadenceDays: 14, lastContact: addDays(today, -3) }),
  ];

  const events = [
    makeEvent({ title: 'Dinner with Sam', date: addDays(today, 2), startTime: '19:30', location: 'Ramen place', peopleIds: [people[0].id], areaId: social.id }),
    makeEvent({ title: 'Team offsite', kind: 'appointment', date: addDays(today, 4), startTime: '09:00', endTime: '17:00', areaId: work.id, location: 'HQ' }),
    makeEvent({ title: 'Dentist', kind: 'appointment', date: addDays(today, 9), startTime: '10:30', areaId: personal.id }),
    makeEvent({ title: 'Climbing', date: addDays(today, -14), startTime: '18:30', peopleIds: [people[5].id], areaId: fitness.id, location: 'The Wall', recurrence: { freq: 'weekly', interval: 1 }, doneDates: [addDays(today, -14), addDays(today, -7)] }),
    makeEvent({ title: 'Call Mum', kind: 'reminder', date: addDays(today, 1), peopleIds: [people[2].id], areaId: social.id }),
    makeEvent({ title: 'Weekend in the hills', kind: 'trip', date: addDays(today, 16), endDate: addDays(today, 18), peopleIds: [people[1].id, people[0].id], areaId: social.id }),
    makeEvent({ title: 'Coffee with Priya', date: addDays(today, -5), startTime: '11:00', peopleIds: [people[1].id], areaId: social.id, done: true }),
  ];

  const journal = [];
  const lines = ['Solid day. Got the launch checklist moving and squeezed in a run.', 'Low energy — skipped the gym, but read a full chapter.', 'Long meetings. Evening walk saved it.', 'Piano is clicking. Played the first 8 bars cleanly.', 'Quiet Sunday. Meal prepped, tidied, feel ready for the week.', 'Busy but good. Dinner with friends.'];
  for (let d = 0; d <= 20; d++) {
    if (seeded(1200 + d) < 0.75) journal.push(makeJournalEntry({ date: addDays(today, -d), mood: 2 + Math.round(seeded(1300 + d) * 3), energy: 2 + Math.round(seeded(1400 + d) * 3), text: d === 0 ? '' : lines[d % lines.length], gratitude: d % 3 === 0 ? 'Sunshine, coffee, a good night of sleep' : '', createdAt: ts(d) }));
  }

  update((d) => {
    d.projects = [...d.projects, pLaunch, pKitchen, pPiano, pSide, pDone];
    d.tasks = [...d.tasks, ...tasks];
    d.habits = [...d.habits, ...habits];
    d.habitLogs = { ...d.habitLogs, ...habitLogs };
    d.workouts = [...d.workouts, ...workouts];
    d.workoutLogs = [...d.workoutLogs, ...workoutLogs];
    d.people = [...d.people, ...people];
    d.events = [...d.events, ...events];
    const existingDates = new Set(d.journal.map((j) => j.date));
    d.journal = [...d.journal, ...journal.filter((j) => !existingDates.has(j.date))];
    if (!d.settings.name) d.settings = { ...d.settings, name: 'Explorer' };
  }, { undo: 'Load sample data' });
  undoToast('Sample data loaded', { duration: 8000 });
}

export { nowISO, addArea };
