"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { addDrink, removeDrink, setDrinkActive } from "@/app/[locale]/(manage)/manage/actions";
import { useI18n } from "@/i18n/I18nProvider";
import type { MenuName } from "@/lib/catalog";
import type { ManageData } from "@/lib/content";
import { shrinkImage, Switch, type Publish } from "./Manager";
import { Sheet } from "./Sheet";

type Filter = "all" | "on" | "off";
const MENUS: MenuName[] = ["evening", "morning"];
const FILTERS: Filter[] = ["all", "on", "off"];

type DrinksProps = { menus: ManageData["menus"]; publish: Publish };

export function Drinks({ menus, publish }: DrinksProps) {
  const { t } = useI18n();
  const m = t.manage;
  const [menu, setMenu] = useState<MenuName>("evening");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<{ id: string; name: string } | null>(null);

  const query = search.trim().toLowerCase();
  const groups = menus[menu]
    .map((group, index) => ({
      ...group,
      index,
      items: group.items.filter(
        (item) => (filter === "all" || item.active === (filter === "on")) && item.name.toLowerCase().includes(query)
      ),
    }))
    .filter((group) => group.items.length);

  const toggle = (id: string, name: string, active: boolean) =>
    publish(
      () => setDrinkActive(id, active),
      {
        busy: m.publishing,
        done: `${name}: ${active ? m.drinkOn : m.drinkOff}`,
        failed: m.publishFailed,
      },
      (catalog) => ({
        ...catalog,
        inactiveDrinks: active ? catalog.inactiveDrinks.filter((item) => item !== id) : [...catalog.inactiveDrinks, id],
      })
    );

  const remove = async () => {
    if (!removing) return;
    const { id, name } = removing;
    setRemoving(null);
    await publish(() => removeDrink(id), { busy: m.publishing, done: `${m.removed}: ${name}`, failed: m.removeFailed });
  };

  return (
    <>
      <div className="manage-toolbar">
        <input
          className="manage-search"
          type="search"
          value={search}
          placeholder={m.searchDrinks}
          aria-label={m.searchDrinks}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="segmented">
          {MENUS.map((name) => (
            <button key={name} type="button" aria-pressed={menu === name} onClick={() => setMenu(name)}>
              {t.menu[name].tab}
            </button>
          ))}
        </div>
        <div className="segmented">
          {FILTERS.map((name) => (
            <button key={name} type="button" aria-pressed={filter === name} onClick={() => setFilter(name)}>
              {m.filters[name]}
            </button>
          ))}
        </div>
      </div>

      {!groups.length && <p className="manage-empty">{m.noDrinks}</p>}

      {groups.map((group) => (
        <section key={group.index} className="manage-group">
          <h3>{group.title}</h3>
          {group.items.map((item) => (
            <div key={item.id} className={`manage-row ${item.active ? "" : "manage-row--off"}`}>
              <div className="manage-row__body">
                <p className="manage-row__name">{item.name}</p>
                <p className="manage-row__meta">{item.price}</p>
                <span className={`manage-row__status manage-row__status--${item.active ? "on" : "off"}`}>
                  {item.active ? m.statusOn : m.statusOff}
                </span>
              </div>
              {item.added && (
                <button
                  type="button"
                  className="manage-row__remove"
                  aria-label={`${m.remove}: ${item.name}`}
                  onClick={() => setRemoving({ id: item.id, name: item.name })}
                >
                  &times;
                </button>
              )}
              <Switch checked={item.active} label={item.name} onChange={(active) => toggle(item.id, item.name, active)} />
            </div>
          ))}
        </section>
      ))}

      <button type="button" className="manage-fab" onClick={() => setAdding(true)}>
        + {m.addDrink}
      </button>

      {adding && <DrinkForm menu={menu} groups={menus} publish={publish} onClose={() => setAdding(false)} />}

      {removing && (
        <Sheet title={m.confirmRemove} compact onClose={() => setRemoving(null)}>
          <div className="manage-confirm">
            <p>{removing.name}</p>
            <div className="manage-confirm__actions">
              <button type="button" className="manage-bt" onClick={() => setRemoving(null)}>
                {m.cancel}
              </button>
              <button type="button" className="manage-bt manage-bt--danger" onClick={remove}>
                {m.remove}
              </button>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}

type FormProps = { menu: MenuName; groups: ManageData["menus"]; publish: Publish; onClose: () => void };

function DrinkForm({ menu: initialMenu, groups, publish, onClose }: FormProps) {
  const { t } = useI18n();
  const m = t.manage;
  const [menu, setMenu] = useState(initialMenu);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const small = await shrinkImage(file);
    setPhoto(small);
    setPreview(URL.createObjectURL(small));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("menu", menu);
    form.delete("photo");
    if (photo) form.set("image", photo);
    const name = String(form.get("name"));
    setBusy(true);
    const ok = await publish(() => addDrink(form), { busy: m.publishing, done: `${m.addedDrink}: ${name}`, failed: m.publishFailed });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Sheet title={m.addDrink} busy={busy} onClose={onClose}>
      <form className="manage-form" onSubmit={submit}>
        <div className="manage-form__fields">
          <div className="segmented">
            {MENUS.map((name) => (
              <button key={name} type="button" aria-pressed={menu === name} onClick={() => setMenu(name)}>
                {t.menu[name].tab}
              </button>
            ))}
          </div>
          <label className="field">
            <span>{m.group}</span>
            <select name="group" key={menu} required>
              {groups[menu].map((group, index) => (
                <option key={index} value={index}>
                  {group.title}
                </option>
              ))}
            </select>
          </label>
          <div className="manage-form__two">
            <label className="field">
              <span>{m.name}</span>
              <input name="name" required maxLength={80} />
            </label>
            <label className="field">
              <span>{m.price}</span>
              <input name="price" required inputMode="numeric" pattern="\d{1,6}" maxLength={6} />
              <small>{m.priceHint}</small>
            </label>
          </div>
          <label className="field">
            <span>{m.note}</span>
            <input name="note" maxLength={200} />
          </label>
          <span className="field">
            <span>{m.photoOptional}</span>
            <label className="manage-photo">
              {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the picked file */}
              {preview ? <img src={preview} alt="" /> : m.pickPhoto}
              <input type="file" name="photo" accept="image/*" aria-label={m.pickPhoto} onChange={pick} />
            </label>
          </span>
          <details>
            <summary>{m.english}</summary>
            <label className="field">
              <span>{m.name}</span>
              <input name="nameEn" maxLength={80} />
            </label>
            <label className="field">
              <span>{m.note}</span>
              <input name="noteEn" maxLength={200} />
            </label>
          </details>
        </div>
        <div className="manage-form__actions">
          <button type="button" className="manage-bt" disabled={busy} onClick={onClose}>
            {m.cancel}
          </button>
          <button type="submit" className="manage-bt manage-bt--primary" disabled={busy}>
            {busy ? m.publishing : m.publish}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
