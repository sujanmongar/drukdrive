import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Button from "./Button";
import { useCurrentUser } from "../lib/currentUser";
import { useAuth } from "../lib/auth";
import { routes } from "../lib/routes";
import { input, label, textarea, dangerAction } from "../lib/ui";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 3)}***@${domain}`;
}

type FieldKey = "gender" | "email" | "phone" | "address" | "bio";
type FieldType = "text" | "email" | "tel" | "select" | "textarea";

// Every row, Legal name included: label over value, Edit on the right.
const rowLabel = "t-body-sm font-semibold text-[color:var(--color-ink)]";

// The inline "click Edit, the row becomes a form in place, Save collapses
// it back to a read-only row" pattern used across the customer and driver
// Personal Info screens — one component so both stay in sync.
export default function PersonalInfoEditor() {
  const { user, updateUser } = useCurrentUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [editingName, setEditingName] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  function startEditName() {
    const [f, ...rest] = user.name.split(" ");
    setFirst(f ?? "");
    setLast(rest.join(" "));
    setEditingName(true);
  }
  function saveName() {
    const name = [first, last].filter(Boolean).join(" ").trim() || user.name;
    updateUser({ name });
    setEditingName(false);
  }

  const [editingField, setEditingField] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState("");

  function startEditField(key: FieldKey) {
    setDraft(String(user[key]));
    setEditingField(key);
  }
  function saveField() {
    if (!editingField) return;
    updateUser({ [editingField]: draft } as Record<FieldKey, string>);
    setEditingField(null);
  }

  function handleDelete() {
    if (
      window.confirm(
        "Delete your account? This can't be undone in this prototype either — you'll be signed out.",
      )
    ) {
      logout();
      navigate(routes.home);
    }
  }

  const rows: {
    key: FieldKey;
    label: string;
    display: string;
    type: FieldType;
  }[] = [
    { key: "gender", label: "Gender", display: user.gender, type: "select" },
    {
      key: "email",
      label: "Email address",
      display: maskEmail(user.email),
      type: "email",
    },
    { key: "phone", label: "Phone number", display: user.phone, type: "tel" },
    { key: "address", label: "Address", display: user.address, type: "text" },
    { key: "bio", label: "Bio", display: user.bio, type: "textarea" },
  ];

  return (
    <div className="mt-6 max-w-2xl">
      <div className="border-b border-[color:var(--color-border)] pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={rowLabel}>Legal name</p>
            {editingName ? (
              <p className="mt-0.5 t-caption">
                This is the name on your travel document, which could be a
                license or a passport.
              </p>
            ) : (
              <p className="mt-0.5 t-body-sm">{user.name}</p>
            )}
          </div>
          {!editingName && (
            <Button variant="link" onClick={startEditName} className="shrink-0">
              Edit
            </Button>
          )}
        </div>

        {editingName && (
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={label}>First name</span>
                <input
                  type="text"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  className={input}
                />
              </label>
              <label>
                <span className={label}>Last name</span>
                <input
                  type="text"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  className={input}
                />
              </label>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Button variant="primary" size="md" onClick={saveName}>
                Save
              </Button>
              <Button variant="link" onClick={() => setEditingName(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {rows.map((row) => (
        <div
          key={row.key}
          className="border-b border-[color:var(--color-border)] py-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className={rowLabel}>{row.label}</p>
              {editingField !== row.key && (
                <p className="mt-0.5 whitespace-pre-wrap t-body-sm">
                  {row.display}
                </p>
              )}
            </div>
            {editingField !== row.key && (
              <Button
                variant="link"
                onClick={() => startEditField(row.key)}
                className="shrink-0"
              >
                Edit
              </Button>
            )}
          </div>

          {editingField === row.key && (
            <div className="mt-3">
              {row.type === "select" ? (
                <select
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className={input}
                >
                  {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              ) : row.type === "textarea" ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className={`${textarea} resize-none`}
                />
              ) : (
                <input
                  type={row.type}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className={input}
                />
              )}
              <div className="mt-3 flex items-center gap-4">
                <Button variant="primary" size="md" onClick={saveField}>
                  Save
                </Button>
                <Button variant="link" onClick={() => setEditingField(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleDelete}
        className={`-mx-4 mt-8 ${dangerAction}`}
      >
        <Icon name="trash" size={15} />
        Delete account
      </button>
    </div>
  );
}
