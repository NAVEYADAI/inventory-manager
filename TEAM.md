# TEAM.md — inventory-manager

> **טיוטה** שנגזרה מהקוד על ידי הקמת `dev-team` — מה שלא אומת מסומן `TODO`. רוצים לרענן? `/dev-team:team-init`.
> הקובץ ש-agents של ה-plugin `dev-team` קוראים ראשון; הוא מתאר איך הפרויקט **הזה** עובד.

## Project
מערכת ניהול מלאי/מתכונים לחברות: חברות, עובדים עם היררכיית הרשאות (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER`), מוצרים,
חומרי גלם, מתכונים, מלאי, plutoon ("platoon"), יומן פעילות. TODO: משפט מוצר אחד מנוה.

## Stack & layout
| Area | Path | Tech |
|---|---|---|
| backend | `back/` | NestJS + TypeORM + PostgreSQL (`DATABASE_URL`), migrations ב-`back/src/migrations/`, מודולים: auth, company, create-product, invetory, platoon, product, raw-material, recipe, recipe-product, activity-log |
| frontend | `front/` | React + Vite + MUI, Vitest (`front/src/test/setup.ts`) |
| e2e | `front/e2e/` | Playwright (פרויקט chromium יחיד, `baseURL` :3000, backend :4000) |
| backend e2e | `back/test/` | Jest e2e (`app.e2e-spec.ts`) |
| deploy | `*/fly.toml`, `deploy.sh` | Fly.io (back + front) |

monorepo עם npm workspaces (`front`, `back`). פיתוח מקומי: `docker-compose.yml` (שירותי `back`, `front`).

## Conventions (read before working)
| Role | Files to read first |
|---|---|
| backend-developer | `back/README.md`, `tests_explanation.md` (מה נבדק בשרת) |
| frontend-developer | `front/README.md`, `front/src/constants`, `front/src/providers` |
| qa-engineer | `tests_explanation.md`, `front/playwright.config.ts`, `test-runner.js` |
| ux-ui-designer | TODO: אין מדריך עיצוב; MUI theme ב-`front/src` — TODO: איפה |
| security-checker | `back/src/auth`, `back/src/password`, `tests_explanation.md` |
| code-reviewer | כל הנ"ל שרלוונטי ל-diff |
| product-manager | TODO: אין backlog עדיין — ר' Backlog |

אין `CLAUDE.md`/`AGENTS.md` בפרויקט. TODO: מומלץ ליצור (כללים שנוה רוצה שיחולו תמיד).

## Commands
| Purpose | Command |
|---|---|
| כל הטסטים | `npm test` (מהשורש: back ואז front; כולל `tsc --noEmit`) |
| backend unit | `npm run test:back` (= `tsc --noEmit && jest`) |
| frontend unit | `npm run test:front` (= `tsc --noEmit && vitest run`) |
| backend e2e | `npm run test:e2e --prefix back` — TODO: מול איזה DB? |
| frontend e2e | `npm run test:e2e` — **ר' Hard rules** |
| הרצה מקומית | `npm run dev --prefix front` ; `npm run start:dev --prefix back` |
| deploy | `npm run deploy` / `./deploy.sh` — **לא להריץ אוטומטית** (מריץ הכל ואז `fly deploy`) |

## Hard rules (never)
- **לא להריץ e2e, `db:clear`, `db:migrate` או migrations עד שמאמתים מול איזה DB הם רצים.** `front/playwright.config.ts`
  מרים את ה-backend עם `reuseExistingServer: true` על `back/.env`, ו-`db:clear` מוחק נתונים — TODO: להגדיר DB בדיקות
  מבודד (כמו `db_test`) ולתעד כאן את ה-host/port.
- לא `git push`, לא `fly deploy`, לא לקרוא `.env`.
- שינוי סכמה דרך migrations של TypeORM: הוספה בלבד; שינוי שם/מחיקה/טיפוס → עוצרים ושואלים. TODO: לאשר את מדיניות ה-DB.

## Backlog
אין backlog עדיין. אם רוצים לעבוד עם `dev-team:tech-lead` / `product-manager`: להפעיל `/dev-team:backlog-protocol`
(יוצר `product-backlog/README.md` עם התבנית) ולרשום כאן את המילים שנבחרו.
- dir: TODO · priority marker: TODO · draft marker: TODO · status strings: TODO

## Definition of done (extra gates)
- טסטים עוברים (`npm test`) ואין שגיאות `tsc` חדשות.
- TODO: מדיניות טסט לתיקון באג? אסטרטגיית e2e? (`tests_explanation.md` מתאר את הקיים.)

## Language & tone
- דיווחים: עברית (התיעוד הקיים בעברית). TODO: שפת ה-UI ואיפה המחרוזות.

## Role notes
### product
### backend
- אין `ValidationPipe` ב-`main.ts` (נבדק) למרות ש-`class-validator`/`class-transformer` מותקנים — TODO: לבדוק אם הוולידציה
  מופעלת ברמת controller/DTO.
### frontend
### qa
- `tests_explanation.md` הוא תיעוד הבדיקות הקיים (שירותי User/Company/Auth, היררכיית הרשאות).
### design
### security
- בדיקות חברות/תפקיד בכל פעולה על משאב של חברה; היררכיית `OWNER > ADMIN > EDITOR > VIEWER` נאכפת בשירות — TODO: לתעד
  היכן. סיסמאות ב-`back/src/password`.
