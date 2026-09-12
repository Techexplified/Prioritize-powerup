import React, { useState } from "react";
import CardPrioritizeModal from "./CardPrioritizeModal.jsx";
import { getCardBadge, FRAMEWORKS } from "../lib/frameworks.js";
import "./kanbanBoard.css";

// SVG Icons
function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Initial columns & cards precisely matching Image 2
const INITIAL_COLUMNS = [
  {
    id: "backlog",
    title: "BACKLOG (TO PRIORITIZE)",
    cards: [
      {
        id: "c1",
        name: "New checkout",
        tags: [
          { label: "Revenue", class: "tag-revenue" },
          { label: "Conversion", class: "tag-conversion" },
        ],
        framework: "RICE",
        reach: 800,
        impact: 3,
        confidence: 0.8,
        effort: 4,
        score: 480,
        badgeClass: "prio-badge-maroon",
        dueDate: "Oct 15",
        checklist: { completed: 3, total: 5 },
        commentsCount: 6,
        attachmentsCount: 2,
        members: [
          { id: "m1", name: "Sarah K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" },
          { id: "m2", name: "David M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" },
        ],
      },
      {
        id: "c2",
        name: "Search improvement",
        tags: [{ label: "Core UX", class: "tag-core-ux" }],
        framework: "RICE",
        reach: 660,
        impact: 3,
        confidence: 0.8,
        effort: 4,
        score: 396,
        badgeClass: "prio-badge-maroon",
        dueDate: "Oct 22",
        checklist: { completed: 1, total: 4 },
        commentsCount: 3,
        attachmentsCount: 1,
        members: [
          { id: "m3", name: "Alex R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80" },
        ],
      },
      {
        id: "c3",
        name: "Mobile redesign",
        tags: [{ label: "Design System", class: "tag-design-system" }],
        framework: "RICE",
        reach: 840,
        impact: 2,
        confidence: 0.8,
        effort: 4,
        score: 336,
        badgeClass: "prio-badge-orange",
        dueDate: "Nov 1",
        checklist: { completed: 2, total: 8 },
        commentsCount: 9,
        attachmentsCount: 4,
        members: [
          { id: "m4", name: "Elena V.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" },
        ],
      },
      {
        id: "c4",
        name: "Email notification triggers",
        tags: [{ label: "Core UX", class: "tag-core-ux" }],
        framework: "RICE",
        reach: 500,
        impact: 2,
        confidence: 0.8,
        effort: 4,
        score: 200,
        badgeClass: "prio-badge-indigo",
        dueDate: "Nov 10",
        checklist: { completed: 4, total: 6 },
        commentsCount: 2,
        attachmentsCount: 1,
        members: [
          { id: "m2", name: "David M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" },
        ],
      },
      {
        id: "c5",
        name: "Dark mode theme support",
        tags: [{ label: "Design System", class: "tag-design-system" }],
        framework: "RICE",
        reach: 400,
        impact: 1,
        confidence: 0.8,
        effort: 2,
        score: 160,
        badgeClass: "prio-badge-orange",
        dueDate: "Nov 18",
        checklist: { completed: 1, total: 3 },
        commentsCount: 5,
        attachmentsCount: 2,
        members: [
          { id: "m1", name: "Sarah K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" },
        ],
      },
    ],
  },
  {
    id: "priority-sprint",
    title: "PRIORITY Q3 SPRINT",
    cards: [
      {
        id: "c6",
        name: "Export to CSV & PDF",
        tags: [{ label: "Reporting", class: "tag-reporting" }],
        framework: "EFFORT VS IMPACT",
        eiImpact: 8.5,
        eiEffort: 2,
        score: 8.5,
        badgeClass: "prio-badge-maroon",
        members: [
          { id: "m3", name: "Alex R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80" },
        ],
      },
      {
        id: "c7",
        name: "One-click social login",
        tags: [{ label: "Conversion", class: "tag-conversion" }],
        framework: "MOSCOW",
        moscowCat: "must",
        score: 100,
        badgeClass: "prio-badge-maroon",
        members: [
          { id: "m5", name: "Julian P.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80" },
        ],
      },
    ],
  },
  {
    id: "in-progress",
    title: "IN PROGRESS",
    cards: [
      {
        id: "c8",
        name: "Stripe webhook retry queue",
        tags: [{ label: "Infrastructure", class: "tag-infrastructure" }],
        framework: "WSJF",
        userValue: 8,
        timeCriticality: 5,
        riskReduction: 6.5,
        jobSize: 1,
        score: 19.5,
        badgeClass: "prio-badge-maroon",
        members: [
          { id: "m2", name: "David M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" },
        ],
      },
    ],
  },
  {
    id: "done-shipped",
    title: "DONE & SHIPPED",
    cards: [
      {
        id: "c9",
        name: "Upgrade Node runtime",
        tags: [{ label: "Infrastructure", class: "tag-infrastructure" }],
        framework: "RICE",
        reach: 500,
        impact: 2,
        confidence: 1.0,
        effort: 5,
        score: 200,
        badgeClass: "prio-badge-indigo",
        members: [
          { id: "m2", name: "David M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" },
        ],
      },
    ],
  },
];

export default function KanbanBoardScreen({ onOpenCardModal, onOpenPanel }) {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [activeBoardFramework, setActiveBoardFramework] = useState("RICE");
  const [editingCard, setEditingCard] = useState(null);
  const [addingToCol, setAddingToCol] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  // Total cards and scored count
  const totalCards = columns.reduce((acc, col) => acc + col.cards.length, 0);
  const scoredCards = columns.reduce(
    (acc, col) => acc + col.cards.filter((c) => c.score !== undefined).length,
    0
  );

  // Click card to open scoring modal
  function handleCardClick(card) {
    if (onOpenCardModal) {
      onOpenCardModal(card);
    } else {
      setEditingCard(card);
    }
  }

  // Handle score update from modal
  function handleSaveCardScore(updatedCard) {
    setColumns((prevCols) =>
      prevCols.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
      }))
    );
    setEditingCard(null);
  }

  // Sort a column by score descending
  function handleSortColumn(colId) {
    setColumns((prevCols) =>
      prevCols.map((col) => {
        if (col.id !== colId) return col;
        const sorted = [...col.cards].sort((a, b) => (b.score || 0) - (a.score || 0));
        return { ...col, cards: sorted };
      })
    );
  }

  // Auto-Rank all columns
  function handleAutoRankAll() {
    setColumns((prevCols) =>
      prevCols.map((col) => ({
        ...col,
        cards: [...col.cards].sort((a, b) => (b.score || 0) - (a.score || 0)),
      }))
    );
  }

  // Add new card to column
  function handleAddCard(colId) {
    if (!newCardTitle.trim()) return;
    const newCard = {
      id: `card-${Date.now()}`,
      name: newCardTitle.trim(),
      tags: [{ label: "Core UX", class: "tag-core-ux" }],
      framework: activeBoardFramework,
      reach: 500,
      impact: 2,
      confidence: 0.8,
      effort: 4,
      score: 200,
      badgeClass: "prio-badge-maroon",
      dueDate: "Nov 30",
      checklist: { completed: 0, total: 3 },
      commentsCount: 0,
      attachmentsCount: 0,
      members: [
        { id: "m1", name: "You", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" },
      ],
    };

    setColumns((prev) =>
      prev.map((col) => (col.id === colId ? { ...col, cards: [...col.cards, newCard] } : col))
    );
    setNewCardTitle("");
    setAddingToCol(null);
  }

  return (
    <div className="kanban-screen-container">
      {/* Top Header Bar matching Image 2 */}
      <div className="kanban-header-bar">
        <div className="kanban-header-left">
          <span className="kanban-active-fw-label">Active Board Framework:</span>
          <span className="kanban-framework-pill-badge">
            {activeBoardFramework}
          </span>
          <span className="kanban-active-fw-desc">
            {FRAMEWORKS[activeBoardFramework]?.description || "Prioritize features that reach and expected impact"}
          </span>
        </div>

        <div className="kanban-header-right">
          <span className="kanban-stats-text">
            Scored <strong>{scoredCards}</strong> of <strong>{totalCards}</strong> cards
          </span>
          <button
            type="button"
            className="kanban-header-action-btn"
            onClick={handleAutoRankAll}
            title="Sort cards in all columns by their priority score"
          >
            <SortIcon />
            Auto-Rank Board
          </button>
          {onOpenPanel && (
            <button
              type="button"
              className="kanban-header-action-btn"
              onClick={onOpenPanel}
            >
              Open Prioritize Panel ↗
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="kanban-board-body">
        {columns.map((col) => (
          <div key={col.id} className="kanban-column">
            {/* Column Header */}
            <div className="kanban-column-header">
              <div className="kanban-column-header-left">
                <h3 className="kanban-column-title">{col.title}</h3>
                <span className="kanban-column-count">{col.cards.length}</span>
              </div>

              <div className="kanban-column-header-actions">
                <button
                  type="button"
                  className="kanban-col-icon-btn"
                  title="Sort column cards by priority score"
                  onClick={() => handleSortColumn(col.id)}
                >
                  <SortIcon />
                </button>
                <button
                  type="button"
                  className="kanban-col-icon-btn"
                  title="Column options"
                >
                  <MoreIcon />
                </button>
              </div>
            </div>

            {/* Cards List in Column */}
            <div className="kanban-column-cards">
              {col.cards.map((card) => {
                const badge = getCardBadge(card);
                const badgeClass =
                  card.badgeClass ||
                  (card.framework === "EFFORT VS IMPACT"
                    ? "prio-badge-maroon"
                    : card.framework === "MOSCOW"
                    ? "prio-badge-maroon"
                    : card.score >= 350
                    ? "prio-badge-maroon"
                    : card.score >= 200
                    ? "prio-badge-indigo"
                    : "prio-badge-orange");

                return (
                  <div
                    key={card.id}
                    className="kanban-card"
                    onClick={() => handleCardClick(card)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Tags row */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="kanban-card-tags">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`kanban-tag ${tag.class || "tag-default"}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Title */}
                    <h4 className="kanban-card-title">{card.name}</h4>

                    {/* Priority Badge */}
                    <div className="kanban-card-badge-row">
                      <span className={`kanban-prio-badge ${badgeClass}`}>
                        <span>{badge?.icon || "🏆"}</span>
                        <span>{badge?.text || `${card.score} ${card.framework || "RICE"}`}</span>
                      </span>
                    </div>

                    {/* Metadata Footer */}
                    <div className="kanban-card-footer">
                      <div className="kanban-card-meta-left">
                        {card.dueDate && (
                          <span className="kanban-meta-item">
                            <CalendarIcon />
                            <span>{card.dueDate}</span>
                          </span>
                        )}

                        {card.checklist && (
                          <span className="kanban-meta-item">
                            <CheckSquareIcon />
                            <span>
                              {card.checklist.completed}/{card.checklist.total}
                            </span>
                          </span>
                        )}

                        {card.commentsCount !== undefined && (
                          <span className="kanban-meta-item">
                            <MessageIcon />
                            <span>{card.commentsCount}</span>
                          </span>
                        )}

                        {card.attachmentsCount !== undefined && (
                          <span className="kanban-meta-item">
                            <PaperclipIcon />
                            <span>{card.attachmentsCount}</span>
                          </span>
                        )}
                      </div>

                      {/* Member avatars on right */}
                      {card.members && card.members.length > 0 && (
                        <div className="kanban-card-avatars">
                          {card.members.map((mem, mIdx) => (
                            <div
                              key={mIdx}
                              className="kanban-avatar-circle"
                              title={mem.name}
                            >
                              {mem.avatar ? (
                                <img
                                  src={mem.avatar}
                                  alt={mem.name}
                                  className="kanban-avatar-img"
                                />
                              ) : (
                                <span>{mem.name.charAt(0)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column Footer: + Add a card */}
            <div className="kanban-column-footer">
              {addingToCol === col.id ? (
                <div className="kanban-add-card-form">
                  <input
                    type="text"
                    placeholder="Enter a title for this card..."
                    className="kanban-add-input"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCard(col.id);
                      if (e.key === "Escape") setAddingToCol(null);
                    }}
                  />
                  <div className="kanban-add-actions">
                    <button
                      type="button"
                      className="kanban-add-submit-btn"
                      onClick={() => handleAddCard(col.id)}
                    >
                      Add card
                    </button>
                    <button
                      type="button"
                      className="kanban-add-cancel-btn"
                      onClick={() => setAddingToCol(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="kanban-add-card-btn"
                  onClick={() => {
                    setAddingToCol(col.id);
                    setNewCardTitle("");
                  }}
                >
                  <PlusIcon />
                  <span>Add a card</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Card Prioritize Modal Overlay (Image 1) */}
      {editingCard && (
        <div
          className="kanban-modal-backdrop"
          onClick={() => setEditingCard(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CardPrioritizeModal
              card={editingCard}
              onApply={handleSaveCardScore}
              onClose={() => setEditingCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
