import React, { useState, useEffect, useMemo } from "react";
import "./prioritize.css";


// Floppy Disk / Save Icon matching Screen 1 Button
function FloppyDiskIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

// Chart/Rank Icon
function RankIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// Checkmark Icon
function CheckIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Plus Icon
function PlusIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Trash Icon
function TrashIcon(props) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Pencil / Edit Icon for set rename
function PencilIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

// Folder Plus Icon for creating new sets
function FolderPlusIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

// Cards / Layers Icon for adding cards to set
function CardsIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="7" width="16" height="13" rx="2" />
      <path d="M6 3h14a2 2 0 0 1 2 2v12" />
    </svg>
  );
}

const FRAMEWORKS = [
  {
    id: "rice",
    label: "RICE — Product/features with reach and expected impact",
    short: "RICE",
    factors: "Reach, Impact, Confidence, Effort",
    formulaText: "(Reach × Impact × Confidence) ÷ Effort",
  },
  {
    id: "ice",
    label: "ICE — Quick, simple prioritization",
    short: "ICE",
    factors: "Impact, Confidence, Effort",
    formulaText: "(Impact × Confidence) ÷ Effort",
  },
  {
    id: "effort-impact",
    label: "Effort vs Impact — Finding quick wins",
    short: "Effort vs Impact",
    factors: "Effort and Impact",
    formulaText: "Impact vs Effort Matrix",
  },
];

// All cards initially start at score 0 until user scores them
const DEFAULT_SAMPLE_CARDS = [
  { id: "c1", name: "New checkout", listName: "Product Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c2", name: "Search improvement", listName: "Product Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c3", name: "Mobile redesign", listName: "Growth Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c4", name: "Email automation", listName: "Growth Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c5", name: "Dark mode theme", listName: "UI Enhancements", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c6", name: "Onboarding flow", listName: "Product Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c7", name: "Stripe billing upgrade", listName: "Product Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c8", name: "Performance optimization", listName: "Tech Debt", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
  { id: "c9", name: "Multi-currency support", listName: "Growth Backlog", framework: "rice", reach: 0, impact: 0, confidence: 0, effort: 0, score: 0, selected: true },
];

// Sets start empty (0 cards) by default
const INITIAL_SETS = [
  {
    id: "set-1",
    name: "Untitled Set",
    cards: [],
  },
];

export default function PrioritizeModal({ t, onClose }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [allBoardCards, setAllBoardCards] = useState(DEFAULT_SAMPLE_CARDS);
  const [boardLists, setBoardLists] = useState([]);

  // Target card when editing scores
  const [targetCard, setTargetCard] = useState(null);
  const [openedFromCard, setOpenedFromCard] = useState(false);
  const [appliedToast, setAppliedToast] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Dialogs & Views: "sets" (Starting UI) | "cards" | "choose-framework" | "score-card"
  const [activeView, setActiveView] = useState("sets");
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Card Picker Dialog state
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [cardSearchQuery, setCardSearchQuery] = useState("");
  const [selectedCardIdsForPicker, setSelectedCardIdsForPicker] = useState(new Set());
  const [selectedListFilter, setSelectedListFilter] = useState("all");

  // Active selected framework
  const [selectedFramework, setSelectedFramework] = useState("rice");

  // RICE factor states (sensible defaults for interactive sliders)
  const [reach, setReach] = useState(500);
  const [impact, setImpact] = useState(2);
  const [confidence, setConfidence] = useState(0.8);
  const [effort, setEffort] = useState(3);

  // ICE factor states
  const [iceImpact, setIceImpact] = useState(7);
  const [iceConfidence, setIceConfidence] = useState(7);
  const [iceEffort, setIceEffort] = useState(3);

  // Effort vs Impact factor states
  const [eiImpact, setEiImpact] = useState(7);
  const [eiEffort, setEiEffort] = useState(3);

  // Active set & cards reference
  const activeSet =
    sets.find((s) => s.id === activeSetId) ||
    sets[0] || {
      id: "set-1",
      name: "Untitled Set",
      cards: [],
    };
  const cards = activeSet.cards || [];

  // Automatically request Trello container resize on view/content updates
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root").catch(() => {});
    }
  }, [activeView, cards.length, sets.length]);

  // Load real cards and saved sets from Trello if available
  useEffect(() => {
    if (!t) return;

    // If opened directly from a card button or card badge
    if (typeof t.card === "function") {
      t.card("id", "name")
        .then((currentCard) => {
          if (currentCard && currentCard.id && currentCard.name) {
            setOpenedFromCard(true);
            Promise.all([
              typeof t.get === "function" ? t.get("card", "shared", "priority_score").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("card", "shared", "priority_framework").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("card", "shared", "priority_reach").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("card", "shared", "priority_impact").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("card", "shared", "priority_confidence").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("card", "shared", "priority_effort").catch(() => null) : Promise.resolve(null),
              typeof t.get === "function" ? t.get("board", "shared", "prio_card_scores").catch(() => null) : Promise.resolve(null),
            ]).then(([cScore, cFw, cReach, cImpact, cConf, cEffort, bScores]) => {
              const bEntry =
                bScores &&
                (bScores[currentCard.id] ||
                  bScores[currentCard.name] ||
                  bScores[(currentCard.name || "").trim()]);

              // Default initial score is 0 if not previously set
              const score =
                cScore !== null && cScore !== undefined
                  ? Number(cScore)
                  : bEntry?.score !== undefined
                  ? Number(bEntry.score)
                  : 0;

              const fw = cFw || bEntry?.framework || "rice";
              const savedReach =
                cReach !== null && cReach !== undefined
                  ? Number(cReach)
                  : bEntry?.reach !== undefined
                  ? Number(bEntry.reach)
                  : 500;

              const savedImpact =
                cImpact !== null && cImpact !== undefined
                  ? Number(cImpact)
                  : bEntry?.impact !== undefined
                  ? Number(bEntry.impact)
                  : 2;

              const savedConf =
                cConf !== null && cConf !== undefined
                  ? Number(cConf)
                  : bEntry?.confidence !== undefined
                  ? Number(bEntry.confidence)
                  : 0.8;

              const savedEffort =
                cEffort !== null && cEffort !== undefined
                  ? Number(cEffort)
                  : bEntry?.effort !== undefined
                  ? Number(bEntry.effort)
                  : 3;

              const cardObj = {
                id: currentCard.id,
                name: currentCard.name,
                framework: fw,
                reach: savedReach,
                impact: savedImpact,
                confidence: savedConf,
                effort: savedEffort,
                score: score,
                selected: true,
              };

              setTargetCard(cardObj);
              setSelectedFramework(fw);
              setReach(savedReach);
              setImpact(savedImpact);
              setConfidence(savedConf);
              setEffort(savedEffort);
              setActiveView("score-card");
            });
          }
        })
        .catch(() => {});
    }

    if (typeof t.cards !== "function") return;

    const getLists = typeof t.lists === "function" ? t.lists("id", "name") : Promise.resolve([]);
    const getCards = t.cards("id", "name", "idList");
    const getBoardScores =
      typeof t.get === "function"
        ? t.get("board", "shared", "prio_card_scores").catch(() => null)
        : Promise.resolve(null);
    const getSavedSets =
      typeof t.get === "function"
        ? t.get("board", "shared", "prio_saved_sets").catch(() => null)
        : Promise.resolve(null);

    Promise.all([getCards, getLists, getBoardScores, getSavedSets])
      .then(([trelloCards, trelloLists, boardScores, savedSets]) => {
        if (trelloCards && trelloCards.length > 0) {
          const cardlyticsListIds = new Set(
            (trelloLists || [])
              .filter((l) => l.name && l.name.toLowerCase().includes("cardlytics"))
              .map((l) => l.id)
          );

          const filteredCards = trelloCards.filter((card) => {
            if (card.idList && cardlyticsListIds.has(card.idList)) return false;
            const name = (card.name || "").trim();
            const isSingleEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]{1,3}$/u.test(name);
            const isNumberOnly = /^[0-9]+$/.test(name);
            return !(isSingleEmoji || isNumberOnly);
          });

          const finalCards = filteredCards.length > 0 ? filteredCards : trelloCards;
          const scoresMap = boardScores && typeof boardScores === "object" ? { ...boardScores } : {};

          const listMap = {};
          (trelloLists || []).forEach((l) => {
            if (l && l.id) listMap[l.id] = l.name;
          });
          setBoardLists(trelloLists || []);

          // Map board cards. Initial score starts at 0 unless explicitly saved!
          const mappedCards = finalCards.map((c) => {
            const cardName = (c.name || "").trim();
            let saved =
              scoresMap[c.id] ||
              scoresMap[cardName] ||
              (cardName ? scoresMap[cardName.toLowerCase()] : null);

            if (!saved && cardName) {
              const found = Object.entries(scoresMap).find(
                ([k]) =>
                  k.toLowerCase() === cardName.toLowerCase() ||
                  cardName.toLowerCase().includes(k.toLowerCase())
              );
              if (found) saved = found[1];
            }

            const score = saved?.score !== undefined ? Number(saved.score) : 0;
            const fw = saved?.framework || "rice";

            return {
              id: c.id,
              name: c.name,
              listName: (c.idList && listMap[c.idList]) || "Backlog",
              framework: fw,
              reach: saved?.reach !== undefined ? Number(saved.reach) : 0,
              impact: saved?.impact !== undefined ? Number(saved.impact) : 0,
              confidence: saved?.confidence !== undefined ? Number(saved.confidence) : 0,
              effort: saved?.effort !== undefined ? Number(saved.effort) : 0,
              iceImpact: saved?.iceImpact || 0,
              iceConfidence: saved?.iceConfidence || 0,
              iceEffort: saved?.iceEffort || 0,
              eiImpact: saved?.eiImpact || 0,
              eiEffort: saved?.eiEffort || 0,
              score: score,
              quadrant: saved?.quadrant,
              selected: true,
            };
          });

          setAllBoardCards(mappedCards);

          // If sets were previously saved on the board, restore them
          if (Array.isArray(savedSets) && savedSets.length > 0) {
            setSets(savedSets);
            setActiveSetId(savedSets[0].id);
          } else {
            // New sets start empty (0 cards)
            const initialSet = {
              id: "set-1",
              name: "Untitled Set",
              cards: [],
            };
            setSets([initialSet]);
            setActiveSetId("set-1");
          }
        }
      })
      .catch((err) => {
        console.warn("Using fallback sample cards:", err);
      });
  }, [t]);

  // Rename set
  function handleRenameSet(setId, newName) {
    setSets((prev) => {
      const next = prev.map((s) => (s.id === setId ? { ...s, name: newName } : s));
      if (t && typeof t.set === "function") {
        t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
      }
      return next;
    });
  }

  // Create new independent set (starts empty with 0 cards)
  function handleCreateNewSet() {
    const newId = `set-${Date.now()}`;
    const newSetNumber = sets.length + 1;
    const newSet = {
      id: newId,
      name: `Untitled Set ${newSetNumber}`,
      cards: [],
    };
    setSets((prev) => {
      const next = [...prev, newSet];
      if (t && typeof t.set === "function") {
        t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
      }
      return next;
    });
    setActiveSetId(newId);
    setAppliedToast(`Created new set: Untitled Set ${newSetNumber}`);
    setTimeout(() => setAppliedToast(null), 3000);
  }

  // Delete set
  function handleDeleteSet(setId) {
    const targetId =
      typeof setId === "string" && setId
        ? setId
        : setToDelete?.id || activeSetId;

    if (sets.length <= 1) {
      alert("At least one evaluation set must be retained.");
      setShowDeleteConfirm(false);
      setSetToDelete(null);
      return;
    }

    const nextSets = sets.filter((s) => s.id !== targetId);
    setSets(nextSets);

    if (activeSetId === targetId && nextSets.length > 0) {
      setActiveSetId(nextSets[0].id);
    }

    if (t && typeof t.set === "function") {
      t.set("board", "shared", "prio_saved_sets", nextSets).catch(() => {});
    }

    setAppliedToast("Set deleted successfully");
    setTimeout(() => setAppliedToast(null), 3000);
    setShowDeleteConfirm(false);
    setSetToDelete(null);
  }

  // Open Card Picker to add cards from board into active set
  function handleOpenCardPicker() {
    const currentCardIds = new Set((activeSet.cards || []).map((c) => c.id));
    setSelectedCardIdsForPicker(currentCardIds);
    setCardSearchQuery("");
    setSelectedListFilter("all");
    setShowCardPicker(true);
  }

  function handleTogglePickerCard(cardId) {
    setSelectedCardIdsForPicker((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  function handlePickerSelectAll(visibleCards) {
    setSelectedCardIdsForPicker((prev) => {
      const next = new Set(prev);
      visibleCards.forEach((c) => next.add(c.id));
      return next;
    });
  }

  function handlePickerClearAll() {
    setSelectedCardIdsForPicker(new Set());
  }

  // Save selected cards from picker into active set
  function handleSaveCardPicker() {
    const basePool = allBoardCards.length > 0 ? allBoardCards : DEFAULT_SAMPLE_CARDS;
    const existingMap = new Map((activeSet.cards || []).map((c) => [c.id, c]));

    const updatedCards = [];
    basePool.forEach((boardCard) => {
      if (selectedCardIdsForPicker.has(boardCard.id)) {
        if (existingMap.has(boardCard.id)) {
          updatedCards.push(existingMap.get(boardCard.id));
        } else {
          updatedCards.push({
            ...boardCard,
            score: boardCard.score || 0,
            reach: boardCard.reach || 0,
            impact: boardCard.impact || 0,
            confidence: boardCard.confidence || 0,
            effort: boardCard.effort || 0,
            selected: true,
          });
        }
      }
    });

    setSets((prev) => {
      const next = prev.map((s) => (s.id === activeSetId ? { ...s, cards: updatedCards } : s));
      if (t && typeof t.set === "function") {
        t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
      }
      return next;
    });

    setShowCardPicker(false);
    setActiveView("cards");
    setAppliedToast(`Updated "${activeSet.name}" with ${updatedCards.length} cards`);
    setTimeout(() => setAppliedToast(null), 3000);
  }

  // Remove individual card from active set
  function handleRemoveCardFromSet(cardId) {
    setSets((prevSets) => {
      const next = prevSets.map((s) => {
        if (s.id === activeSetId) {
          return {
            ...s,
            cards: (s.cards || []).filter((c) => c.id !== cardId),
          };
        }
        return s;
      });
      if (t && typeof t.set === "function") {
        t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
      }
      return next;
    });
  }

  // Select all / clear within active set
  function handleSelectAll() {
    setSets((prev) =>
      prev.map((s) =>
        s.id === activeSetId
          ? { ...s, cards: (s.cards || []).map((c) => ({ ...c, selected: true })) }
          : s
      )
    );
  }

  function handleClearAll() {
    setSets((prev) =>
      prev.map((s) =>
        s.id === activeSetId
          ? { ...s, cards: (s.cards || []).map((c) => ({ ...c, selected: false })) }
          : s
      )
    );
  }

  // Toggle card within active set
  function handleToggleCard(cardId) {
    setSets((prev) =>
      prev.map((s) =>
        s.id === activeSetId
          ? {
              ...s,
              cards: (s.cards || []).map((c) =>
                c.id === cardId ? { ...c, selected: !c.selected } : c
              ),
            }
          : s
      )
    );
  }

  // Open framework selection screen when user clicks "Edit scores"
  function handleOpenFrameworkSelect(card) {
    setTargetCard(card);
    const fw = card?.framework || "rice";
    setSelectedFramework(fw);

    // Initialize factor states from card; if card was 0 / unscored, provide sensible defaults so user can slide
    const hasExistingScore = card?.score && card.score > 0;
    setReach(card?.reach && card.reach > 0 ? card.reach : (hasExistingScore ? 800 : 500));
    setImpact(card?.impact && card.impact > 0 ? card.impact : (hasExistingScore ? 3 : 2));
    setConfidence(card?.confidence && card.confidence > 0 ? card.confidence : (hasExistingScore ? 0.8 : 0.8));
    setEffort(card?.effort && card.effort > 0 ? card.effort : (hasExistingScore ? 4 : 3));
    setIceImpact(card?.iceImpact && card.iceImpact > 0 ? card.iceImpact : 7);
    setIceConfidence(card?.iceConfidence && card.iceConfidence > 0 ? card.iceConfidence : 7);
    setIceEffort(card?.iceEffort && card.iceEffort > 0 ? card.iceEffort : 3);
    setEiImpact(card?.eiImpact && card.eiImpact > 0 ? card.eiImpact : 7);
    setEiEffort(card?.eiEffort && card.eiEffort > 0 ? card.eiEffort : 3);

    setActiveView("choose-framework");
  }

  // Proceed from framework selection to score editing screen
  function handleProceedToScore() {
    setActiveView("score-card");
  }

  // Cancel back to cards list
  function handleCancelToCards() {
    setActiveView("cards");
    setTargetCard(null);
  }

  // Live score calculation
  const computedScore = useMemo(() => {
    if (selectedFramework === "rice") {
      const r = Number(reach) || 0;
      const imp = Number(impact) || 1;
      const conf = Number(confidence) || 1;
      const eff = Math.max(0.5, Number(effort) || 1);
      return Math.round((r * imp * conf) / eff);
    }
    if (selectedFramework === "ice") {
      const imp = Number(impact) || 1;
      const conf = Number(confidence) || 1;
      const eff = Math.max(0.5, Number(effort) || 1);
      return Math.round((imp * conf * 100) / eff);
    }
    if (selectedFramework === "effort-impact") {
      const imp = Number(impact) || 1;
      const eff = Math.max(1, Number(effort) || 1);
      return Math.round(((imp * 3.33) / eff * 3.5 + 2) * 10) / 10;
    }
    return 0;
  }, [selectedFramework, reach, impact, confidence, effort]);

  // Quadrant for Effort vs Impact
  const computedQuadrant = useMemo(() => {
    if (selectedFramework !== "effort-impact") return null;
    const isHighImpact = Number(impact) >= 1.5; // High (2) or Massive (3)
    const isLowEffort = Number(effort) <= 5;
    if (isHighImpact && isLowEffort) return "🌟 Quick Win";
    if (isHighImpact && !isLowEffort) return "🚀 Major Project";
    if (!isHighImpact && isLowEffort) return "⚡ Fill-in";
    return "⏳ Thankless Task";
  }, [selectedFramework, impact, effort]);

  // Impact label formatting for RICE
  const impactLabel = useMemo(() => {
    if (impact === 0.25) return "0.25 (Min)";
    if (impact === 0.5) return "0.5 (Low)";
    if (impact === 1) return "1 (Med)";
    if (impact === 2) return "2 (High)";
    if (impact === 3) return "3 (Massive)";
    return `${impact}`;
  }, [impact]);

  // Confidence label formatting for RICE
  const confidenceLabel = useMemo(() => {
    return `${Math.round(confidence * 100)}%`;
  }, [confidence]);

  // Save score and return to main screen (where scores are displayed)
  async function handleApplyScoreAndReturn() {
    if (targetCard) {
      const updatedCard = {
        ...targetCard,
        framework: selectedFramework,
        score: computedScore,
        reach,
        impact,
        confidence,
        effort,
        quadrant: computedQuadrant,
      };

      // Update strictly within the active set
      setSets((prevSets) => {
        const next = prevSets.map((s) => {
          if (s.id === activeSetId) {
            return {
              ...s,
              cards: (s.cards || []).map((c) =>
                c.id === targetCard.id ? updatedCard : c
              ),
            };
          }
          return s;
        });
        if (t && typeof t.set === "function") {
          t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
        }
        return next;
      });

      // Save to Trello shared data
      if (t && typeof t.set === "function") {
        try {
          // 1. Save directly to card scope
          await Promise.all([
            t.set("card", "shared", "priority_score", computedScore).catch(() => {}),
            t.set("card", "shared", "priority_framework", selectedFramework).catch(() => {}),
            t.set("card", "shared", "priority_reach", reach).catch(() => {}),
            t.set("card", "shared", "priority_impact", impact).catch(() => {}),
            t.set("card", "shared", "priority_confidence", confidence).catch(() => {}),
            t.set("card", "shared", "priority_effort", effort).catch(() => {}),
            computedQuadrant
              ? t.set("card", "shared", "priority_quadrant", computedQuadrant).catch(() => {})
              : t.remove
              ? t.remove("card", "shared", "priority_quadrant").catch(() => {})
              : Promise.resolve(),
          ]);

          // 2. ALWAYS save to board scope so card-badges on Trello board can display it
          if (typeof t.get === "function") {
            const existing = await t.get("board", "shared", "prio_card_scores").catch(() => ({}));
            const map = existing && typeof existing === "object" ? { ...existing } : {};
            const entry = {
              score: computedScore,
              framework: selectedFramework,
              cardName: targetCard.name,
              reach,
              impact,
              confidence,
              effort,
              iceImpact,
              iceConfidence,
              iceEffort,
              eiImpact,
              eiEffort,
              quadrant: computedQuadrant,
              updatedAt: Date.now(),
            };
            if (targetCard.id) map[targetCard.id] = entry;
            if (targetCard.name) {
              map[targetCard.name] = entry;
              map[targetCard.name.trim()] = entry;
              map[targetCard.name.trim().toLowerCase()] = entry;
            }
            await t.set("board", "shared", "prio_card_scores", map).catch(() => {});
          }
        } catch (err) {
          console.warn("Failed saving priority to Trello:", err);
        }
      }

      // If modal was opened from a specific card in Trello, wait 150ms before closing
      if (openedFromCard && t && typeof t.closeModal === "function") {
        setTimeout(() => {
          t.closeModal();
        }, 150);
        return;
      }

      // Show toast on cards screen
      setAppliedToast(targetCard.name);
      setTimeout(() => setAppliedToast(null), 4000);
    }

    // Return to main cards screen
    setActiveView("cards");
    setTargetCard(null);
  }

  // Sync all cards' scores in this set to the Trello board
  function handleSyncAllToBoard() {
    if (t && typeof t.set === "function" && typeof t.get === "function") {
      t.get("board", "shared", "prio_card_scores")
        .then((existing) => {
          const map = existing && typeof existing === "object" ? { ...existing } : {};
          cards.forEach((c) => {
            if (c.score !== undefined) {
              const entry = {
                score: c.score,
                framework: c.framework || "rice",
                cardName: c.name,
                reach: c.reach,
                impact: c.impact,
                confidence: c.confidence,
                effort: c.effort,
                iceImpact: c.iceImpact,
                iceConfidence: c.iceConfidence,
                iceEffort: c.iceEffort,
                eiImpact: c.eiImpact,
                eiEffort: c.eiEffort,
                quadrant: c.quadrant,
              };
              if (c.id) map[c.id] = entry;
              if (c.name) {
                map[c.name] = entry;
                map[c.name.trim()] = entry;
              }
            }
          });
          return t.set("board", "shared", "prio_card_scores", map);
        })
        .then(() => {
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 3000);
        })
        .catch(() => {});
    }
  }

  // Auto-Rank cards within active set
  function handleToggleRank() {
    setSets((prevSets) => {
      const next = prevSets.map((s) => {
        if (s.id === activeSetId) {
          const currentCards = s.cards || [];
          if (isSortedByRank) {
            return {
              ...s,
              cards: [...currentCards].sort((a, b) => (a.id > b.id ? 1 : -1)),
            };
          } else {
            return {
              ...s,
              cards: [...currentCards].sort((a, b) => (b.score || 0) - (a.score || 0)),
            };
          }
        }
        return s;
      });
      if (t && typeof t.set === "function") {
        t.set("board", "shared", "prio_saved_sets", next).catch(() => {});
      }
      return next;
    });
    setIsSortedByRank(!isSortedByRank);
  }

  const selectedCount = cards.filter((c) => c.selected).length;
  const scoredCount = cards.filter((c) => c.score && c.score > 0).length;
  const currentFw = FRAMEWORKS.find((f) => f.id === selectedFramework) || FRAMEWORKS[0];

  const topThreeCards = useMemo(() => {
    return [...cards]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3);
  }, [cards]);

  const availablePool = allBoardCards.length > 0 ? allBoardCards : DEFAULT_SAMPLE_CARDS;
  const pickerLists = useMemo(() => {
    const listSet = new Set();
    availablePool.forEach((c) => {
      if (c.listName) listSet.add(c.listName);
    });
    return Array.from(listSet);
  }, [availablePool]);

  const filteredPickerCards = useMemo(() => {
    return availablePool.filter((c) => {
      if (selectedListFilter !== "all" && c.listName !== selectedListFilter) {
        return false;
      }
      if (cardSearchQuery.trim()) {
        const q = cardSearchQuery.toLowerCase();
        return (c.name || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [availablePool, selectedListFilter, cardSearchQuery]);

  // Dynamic slider percentages
  const reachPercent = Math.min(100, Math.max(0, (reach / 2000) * 100));
  const effortPercent = Math.min(100, Math.max(0, ((effort - 1) / 9) * 100));
  const eiImpactPercent = Math.min(100, Math.max(0, (eiImpact / 10) * 100));
  const eiEffortPercent = Math.min(100, Math.max(0, ((eiEffort - 1) / 9) * 100));

  return (
    <div className="prio-container">
      {/* Top Header - displayed on Starting UI & cards screen */}
      {activeView !== "choose-framework" && activeView !== "score-card" && (
        <header className="prio-header">
          <div className="prio-header-brand">
            <div className="prio-brand-icon">
              <RankIcon />
            </div>
            <div className="prio-brand-titles">
              <div className="prio-title-line">
                <h1 className="prio-title-text">Prioritize</h1>
                <span className="prio-powerup-tag">Power-Up</span>
              </div>
              <p className="prio-subtitle-text">
                {activeView === "sets"
                  ? "Manage evaluation sets and prioritize cards individually."
                  : `Evaluation Set: ${activeSet.name}`}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {activeView === "cards" && (
              <button
                type="button"
                className="prio-back-to-sets-btn"
                onClick={() => setActiveView("sets")}
                title="Return to Sets Hub"
              >
                ← Back to Sets
              </button>
            )}
            {t && typeof t.closeModal === "function" && (
              <button
                type="button"
                className="prio-btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", whiteSpace: "nowrap" }}
                onClick={() => {
                  handleSyncAllToBoard();
                  setTimeout(() => t.closeModal(), 120);
                }}
                title="Save all scores and return to board"
              >
                Done (View Board)
              </button>
            )}
          </div>
        </header>
      )}

      {/* ========================================================= */}
      {/* VIEW 0: STARTING UI (SETS HUB)                            */}
      {/* ========================================================= */}
      {activeView === "sets" && (
        <div className="prio-start-view">
          <div className="prio-start-header">
            <h2 className="prio-start-title">Prioritize Evaluation Sets</h2>
            <p className="prio-start-subtitle">
              Organize cards into independent evaluation groups, customize scoring frameworks, and rank your team's top priorities.
            </p>
          </div>

          {/* Evaluation Sets Tabs Bar */}
          <div className="prio-start-tabs-wrapper">
            {sets.map((s) => (
              <div
                key={s.id}
                className={`prio-start-tab ${s.id === activeSetId ? "active" : ""}`}
                onClick={() => setActiveSetId(s.id)}
              >
                <span>📁 {s.name || "Untitled Set"}</span>
                <span style={{ fontSize: "11px", opacity: 0.8 }}>
                  ({(s.cards || []).length})
                </span>
                {sets.length > 1 && (
                  <button
                    type="button"
                    className="prio-start-tab-delete"
                    title="Delete this set"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSetToDelete(s);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="prio-start-tab-add"
              onClick={handleCreateNewSet}
              title="Create a new independent set"
            >
              <PlusIcon /> New Set
            </button>
          </div>

          {/* Active Set Hero Card */}
          <div className="prio-start-hero-card">
            <div className="prio-set-card-top">
              <span className="prio-set-badge-tag">Current Set</span>
              <span className="prio-set-independent-pill">
                <span className="prio-pulse-dot"></span> Performs Individually
              </span>
            </div>

            {/* Editable Set Name Field */}
            <div className="prio-start-title-container">
              <label className="prio-start-title-label">Set Name</label>
              <div className="prio-start-title-box">
                <input
                  type="text"
                  className="prio-start-title-input"
                  value={activeSet.name}
                  onChange={(e) => handleRenameSet(activeSet.id, e.target.value)}
                  placeholder="Untitled Set"
                  title="Click to rename this set"
                />
                <span className="prio-start-edit-icon" title="Editable title">
                  <PencilIcon />
                </span>
              </div>
            </div>

            {/* Set Stats Summary */}
            <div className="prio-set-stats-row">
              <div className="prio-stat-box">
                <span className="prio-stat-box-label">Total Cards</span>
                <span className="prio-stat-box-val">{cards.length}</span>
              </div>
              <div className="prio-stat-box">
                <span className="prio-stat-box-label">Scored</span>
                <span className="prio-stat-box-val highlight">{scoredCount}</span>
              </div>
              <div className="prio-stat-box">
                <span className="prio-stat-box-label">Initial Score</span>
                <span className="prio-stat-box-val">0 (Zero)</span>
              </div>
            </div>

            {/* If cards already exist in the set: Top 3 Priorities + Focused Ready Banner + Quick Actions */}
            {cards.length > 0 ? (
              <>
                {/* Top Priorities Preview (Top 3 Cards) */}
                <div className="prio-top3-preview-section">
                  <div className="prio-top3-header">
                    <div className="prio-top3-header-left">
                      <span className="prio-top3-title">Top Priorities</span>
                      <span className="prio-top3-badge">
                        Top {Math.min(3, cards.length)} of {cards.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="prio-top3-show-all-btn"
                      onClick={() => setActiveView("cards")}
                      title="View all cards in this set"
                    >
                      Show all cards ({cards.length}) →
                    </button>
                  </div>

                  <div className="prio-top3-list">
                    {topThreeCards.map((card, idx) => {
                      const isHighPriority = card.score >= 350;
                      const isZero = !card.score || card.score === 0;

                      return (
                        <div key={card.id} className="prio-top3-item">
                          <div className="prio-top3-item-left">
                            <span
                              className={`prio-rank-pill ${isZero ? "unscored" : ""}`}
                              style={
                                !isZero
                                  ? isHighPriority
                                    ? {
                                        background: "rgba(248, 113, 104, 0.16)",
                                        borderColor: "rgba(248, 113, 104, 0.4)",
                                        color: "#FCA5A5",
                                      }
                                    : card.score >= 100
                                    ? {
                                        background: "rgba(87, 157, 255, 0.14)",
                                        borderColor: "rgba(87, 157, 255, 0.35)",
                                        color: "#579DFF",
                                      }
                                    : {}
                                  : {}
                              }
                            >
                              {`#${idx + 1} · `}
                              {!isZero
                                ? card.quadrant
                                  ? card.quadrant
                                  : `🏆 ${card.score} ${(card.framework || "RICE").toUpperCase()}`
                                : `0 ${(card.framework || "RICE").toUpperCase()}`}
                            </span>

                            <span
                              className="prio-top3-card-name"
                              onClick={() => handleOpenFrameworkSelect(card)}
                              title="Click to edit scores"
                            >
                              {card.name}
                            </span>

                            {card.listName && (
                              <span className="prio-picker-list-tag" style={{ marginLeft: "4px" }}>
                                {card.listName}
                              </span>
                            )}
                          </div>

                          <div className="prio-top3-item-right">
                            <button
                              type="button"
                              className="prio-score-link"
                              onClick={() => handleOpenFrameworkSelect(card)}
                            >
                              Edit scores
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="prio-start-ready-section">
                  <div
                    className="prio-start-ready-banner"
                    onClick={() => setActiveView("cards")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveView("cards");
                      }
                    }}
                  >
                    <div className="prio-ready-left">
                      <div className="prio-ready-icon-wrap">
                        <RankIcon />
                      </div>
                      <div className="prio-ready-content">
                        <div className="prio-ready-title-row">
                          <h3 className="prio-ready-title">
                            Show All Cards &amp; Scores ({activeSet.name})
                          </h3>
                          <span className="prio-ready-badge">
                            {cards.length} {cards.length === 1 ? "card" : "cards"} loaded
                          </span>
                        </div>
                        <p className="prio-ready-desc">
                          Open matrix view to evaluate factors, auto-calculate scores, and sync priority badges.
                        </p>
                      </div>
                    </div>
                    <button type="button" className="prio-ready-cta-btn">
                      Open Priority Matrix →
                    </button>
                  </div>

                  <div className="prio-start-secondary-bar">
                    <button
                      type="button"
                      className="prio-btn-quick-action"
                      onClick={handleOpenCardPicker}
                      title="Add or remove cards from board in this set"
                    >
                      <CardsIcon /> Manage Cards in Set ({cards.length})
                    </button>
                    <button
                      type="button"
                      className="prio-btn-quick-action"
                      onClick={handleCreateNewSet}
                      title="Start a new evaluation set that calculates independently"
                    >
                      <FolderPlusIcon /> Create New Set
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* If set is empty (0 cards): Show the 2 clear starting options */
              <div className="prio-start-actions-grid">
                {/* Option 1: Add cards to this set */}
                <div
                  className="prio-action-card primary"
                  onClick={handleOpenCardPicker}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleOpenCardPicker();
                    }
                  }}
                >
                  <div className="prio-action-card-header">
                    <div className="prio-action-card-icon primary">
                      <CardsIcon />
                    </div>
                    <span className="prio-action-card-badge primary">Option 1</span>
                  </div>
                  <div className="prio-action-card-body">
                    <h3 className="prio-action-card-title">Add cards to this set</h3>
                    <p className="prio-action-card-desc">
                      Select cards from your Trello board to evaluate in {activeSet.name}
                    </p>
                  </div>
                  <div className="prio-action-card-footer">
                    <span className="prio-action-cta-btn primary">
                      Select Cards from Board →
                    </span>
                  </div>
                </div>

                {/* Option 2: Create new set */}
                <div
                  className="prio-action-card secondary"
                  onClick={handleCreateNewSet}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCreateNewSet();
                    }
                  }}
                >
                  <div className="prio-action-card-header">
                    <div className="prio-action-card-icon secondary">
                      <FolderPlusIcon />
                    </div>
                    <span className="prio-action-card-badge secondary">Option 2</span>
                  </div>
                  <div className="prio-action-card-body">
                    <h3 className="prio-action-card-title">Create new set</h3>
                    <p className="prio-action-card-desc">
                      Start a new evaluation set that calculates and ranks independently
                    </p>
                  </div>
                  <div className="prio-action-card-footer">
                    <span className="prio-action-cta-btn secondary">
                      + Create New Set
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="prio-start-info-footer">
            <span>💡</span>
            <span>
              All cards start at an initial score of <strong>0</strong> until scored. Each set maintains its own independent ranking.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 1: CHOOSE FRAMEWORK SCREEN                           */}
      {/* ========================================================= */}
      {activeView === "choose-framework" && (
        <>
          <div className="prio-framework-view">
            <div className="prio-framework-header-info">
              <h2 className="prio-framework-screen-label">Choose Framework</h2>
              <p className="prio-framework-card-subtitle">
                {targetCard ? (
                  <>
                    Selecting framework for: <strong>{targetCard.name}</strong>
                  </>
                ) : (
                  "Select an evaluation framework to prioritize cards."
                )}
              </p>
            </div>

            {/* Main Framework Dropdown */}
            <select
              className="prio-framework-main-dropdown"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              {FRAMEWORKS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Framework Details List */}
            <div className="prio-framework-cards-container">
              {FRAMEWORKS.map((f) => {
                const isSelected = f.id === selectedFramework;
                return (
                  <div
                    key={f.id}
                    className={`prio-framework-info-box ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedFramework(f.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="prio-framework-info-main">
                      <div className="prio-framework-info-title">
                        <span>{f.short}</span>
                        {isSelected && (
                          <span className="prio-framework-tag-active">Selected</span>
                        )}
                      </div>
                      <div className="prio-framework-info-factors">
                        Factors: {f.factors}
                      </div>
                    </div>
                    <div className={`prio-framework-status-badge ${isSelected ? "active" : ""}`}>
                      {isSelected ? "✓ Active" : "Select"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row: Advance to Score Card */}
          <div className="prio-framework-action-row">
            <button
              type="button"
              className="prio-btn-secondary"
              onClick={handleCancelToCards}
            >
              ← Back to Cards
            </button>
            <button
              type="button"
              className="prio-btn-primary"
              onClick={handleProceedToScore}
            >
              Continue to Edit Scores →
            </button>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: SCORE CARD SCREEN (MATCHING USER REFERENCE IMAGE) */}
      {/* ========================================================= */}
      {activeView === "score-card" && (
        <>
          <div className="prio-scoring-screen">
            {/* Header matching image */}
            <div className="prio-scoring-header">
              <div className="prio-scoring-header-left">
                <button
                  type="button"
                  className="prio-back-btn"
                  onClick={() => setActiveView("choose-framework")}
                  title="Back to Framework Selection"
                >
                  ←
                </button>
                <div className="prio-brand-icon">
                  <RankIcon />
                </div>
                <div className="prio-scoring-titles">
                  <h2 className="prio-scoring-title-text">PRIORITIZE</h2>
                  <p className="prio-scoring-subtitle">
                    Power-Up on this card
                    {targetCard && (
                      <span className="prio-scoring-target-tag">
                        · {targetCard.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Framework Dropdown */}
              <div className="prio-scoring-fw-wrap">
                <span className="prio-scoring-fw-label">Framework:</span>
                <select
                  className="prio-scoring-fw-dropdown"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  {FRAMEWORKS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.short}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider line matching reference */}
            <div className="prio-scoring-divider" />

            {/* Factor Controls */}
            <div className="prio-scoring-body">
              {/* RICE SCORING (EXACT PHOTO FEATURES) */}
              {selectedFramework === "rice" && (
                <>
                  {/* Reach */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Reach (users/month impacted)</span>
                      <span className="prio-scoring-val-blue">{reach}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={reach}
                      onChange={(e) => setReach(Number(e.target.value))}
                      className="prio-range-slider prio-slider-blue"
                      style={{
                        background: `linear-gradient(to right, #2563EB 0%, #2563EB ${reachPercent}%, #CBD5E1 ${reachPercent}%, #CBD5E1 100%)`,
                      }}
                    />
                  </div>

                  {/* Impact */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact (per user)</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Confidence</span>
                      <span className="prio-scoring-val-white">{confidenceLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.5, label: "50% (Low)" },
                        { val: 0.8, label: "80% (Medium)" },
                        { val: 1.0, label: "100% (High)" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${confidence === item.val ? "active" : ""}`}
                          onClick={() => setConfidence(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effort */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort (person-months or sprints)</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* ICE SCORING (SAME RICH SEGMENTED PILLS & CONTROLS) */}
              {selectedFramework === "ice" && (
                <>
                  {/* Impact */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact (per user)</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Confidence</span>
                      <span className="prio-scoring-val-white">{confidenceLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.5, label: "50% (Low)" },
                        { val: 0.8, label: "80% (Medium)" },
                        { val: 1.0, label: "100% (High)" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${confidence === item.val ? "active" : ""}`}
                          onClick={() => setConfidence(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effort / Ease */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort / Ease (person-months or sprints)</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* EFFORT VS IMPACT SCORING */}
              {selectedFramework === "effort-impact" && (
                <>
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* Result Score Card */}
              <div className="prio-score-result-card">
                {selectedFramework === "effort-impact" ? (
                  <div className="prio-ei-result-content">
                    <div className="prio-ei-result-top">
                      <span className="prio-score-result-label">EFFORT VS IMPACT MATRIX</span>
                      <span className="prio-score-result-score-tag">Score: {computedScore}</span>
                    </div>
                    <div className="prio-quadrant-row">
                      <div
                        className={`prio-quadrant-pill ${
                          computedQuadrant?.includes("Quick Win")
                            ? "quad-quick-win"
                            : computedQuadrant?.includes("Major Project")
                            ? "quad-major-project"
                            : computedQuadrant?.includes("Fill-in")
                            ? "quad-fill-in"
                            : "quad-thankless"
                        }`}
                      >
                        {computedQuadrant}
                      </div>
                      <span className="prio-quadrant-subtitle">
                        {computedQuadrant?.includes("Quick Win")
                          ? "High Impact · Low Effort — Priority #1"
                          : computedQuadrant?.includes("Major Project")
                          ? "High Impact · High Effort — Strategic Bet"
                          : computedQuadrant?.includes("Fill-in")
                          ? "Low Impact · Low Effort — Secondary"
                          : "Low Impact · High Effort — Deprioritize"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="prio-numeric-result-content">
                    <span className="prio-score-result-label">{currentFw.short} SCORE</span>
                    <div className="prio-numeric-result-row">
                      <span className="prio-score-result-number">{computedScore}</span>
                      <span className="prio-score-badge-preview">
                        {computedScore >= 350 ? "🏆 High Priority" : computedScore >= 200 ? "🎯 Medium Priority" : "⚡ Fill-in"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                className="prio-btn-apply"
                onClick={handleApplyScoreAndReturn}
              >
                <FloppyDiskIcon />
                <span>Apply {currentFw.short} Badge to Card</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: MAIN CARDS LIST (WHERE SCORES ARE DISPLAYED)      */}
      {/* ========================================================= */}
      {activeView === "cards" && (
        <>
          {/* Controls & Filter Bar */}
          <div className="prio-controls-bar">
            <div className="prio-section-heading">
              <span className="prio-heading-title">Cards in "{activeSet.name}"</span>
              <span className="prio-count-badge">
                {cards.length} cards
              </span>
            </div>

            <div className="prio-controls-right">
              {cards.length > 0 && (
                <>
                  <button
                    type="button"
                    className="prio-quick-link"
                    onClick={handleSelectAll}
                  >
                    Select all
                  </button>
                  <span className="prio-dot-divider">·</span>
                  <button
                    type="button"
                    className="prio-quick-link"
                    onClick={handleClearAll}
                  >
                    Clear
                  </button>
                </>
              )}

              {sets.length > 1 && (
                <>
                  <span className="prio-dot-divider">·</span>
                  <select
                    value={activeSetId}
                    onChange={(e) => setActiveSetId(e.target.value)}
                    className="prio-set-selector"
                    title="Switch active set"
                  >
                    {sets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({ (s.cards || []).length })
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Success Toast */}
          {appliedToast && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                color: "#86EFAC",
                borderRadius: "6px",
                padding: "8px 14px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>
                ✓ {appliedToast}
              </span>
              <button
                type="button"
                onClick={() => setAppliedToast(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#86EFAC",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* If Set has 0 cards, show clean Empty State */}
          {cards.length === 0 ? (
            <div className="prio-empty-set-state">
              <div className="prio-empty-icon-wrap">
                <CardsIcon />
              </div>
              <h3 className="prio-empty-title">No cards in "{activeSet.name}" yet</h3>
              <p className="prio-empty-desc">
                Select cards from your Trello board to evaluate and prioritize within this set.
              </p>
              <button
                type="button"
                className="prio-btn-primary prio-btn-large"
                style={{ width: "auto", padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                onClick={handleOpenCardPicker}
              >
                <PlusIcon /> Add Cards from Board
              </button>
            </div>
          ) : (
            /* Cards List Box */
            <div className="prio-list-container">
              <div className="prio-card-scroll-area">
                {cards.map((card, idx) => {
                  const isHighPriority = card.score >= 350;
                  const isZero = !card.score || card.score === 0;

                  return (
                    <div
                      key={card.id}
                      className={`prio-card-item ${card.selected ? "selected" : "deselected"}`}
                    >
                      <div className="prio-card-item-left">
                        <label className="prio-checkbox-container">
                          <input
                            type="checkbox"
                            className="prio-native-checkbox"
                            checked={Boolean(card.selected)}
                            onChange={() => handleToggleCard(card.id)}
                          />
                          <div className="prio-checkbox-box">
                            {card.selected && <CheckIcon className="prio-check-svg" />}
                          </div>
                        </label>
                        <span
                          className="prio-card-name-text"
                          onClick={() => handleOpenFrameworkSelect(card)}
                          title="Click to edit scores"
                        >
                          {card.name}
                        </span>
                        {card.listName && (
                          <span className="prio-picker-list-tag" style={{ marginLeft: "6px" }}>
                            {card.listName}
                          </span>
                        )}
                      </div>

                      <div className="prio-card-item-right">
                        <span
                          className={`prio-rank-pill ${isZero ? "unscored" : ""}`}
                          title={
                            !isZero
                              ? `Prioritization Score: ${card.score} (${(card.framework || "RICE").toUpperCase()})`
                              : "Initial score: 0 (Click 'Edit scores' to score this card)"
                          }
                          style={
                            !isZero
                              ? isHighPriority
                                ? {
                                    background: "rgba(248, 113, 104, 0.16)",
                                    borderColor: "rgba(248, 113, 104, 0.4)",
                                    color: "#FCA5A5",
                                  }
                                : card.score >= 100
                                ? {
                                    background: "rgba(87, 157, 255, 0.14)",
                                    borderColor: "rgba(87, 157, 255, 0.35)",
                                    color: "#579DFF",
                                  }
                                : {}
                              : {}
                          }
                        >
                          {isSortedByRank && !isZero ? `#${idx + 1} · ` : ""}
                          {!isZero
                            ? card.quadrant
                              ? card.quadrant
                              : `🏆 ${card.score} ${(card.framework || "RICE").toUpperCase()}`
                            : `0 ${(card.framework || "RICE").toUpperCase()}`}
                        </span>

                        <button
                          type="button"
                          className="prio-score-link"
                          onClick={() => handleOpenFrameworkSelect(card)}
                        >
                          Edit scores
                        </button>

                        <button
                          type="button"
                          className="prio-card-remove-link"
                          onClick={() => handleRemoveCardFromSet(card.id)}
                          title="Remove card from this set"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="prio-action-bar">
            <div className="prio-action-group-left">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={handleOpenCardPicker}
                title="Add cards from your board to this set"
              >
                <PlusIcon />
                Add Cards
              </button>
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={handleCreateNewSet}
                title="Create a new evaluation set"
              >
                <FolderPlusIcon />
                New Set
              </button>
              {sets.length > 1 && (
                <button
                  type="button"
                  className="prio-btn-danger-subtle"
                  onClick={() => {
                    setSetToDelete(activeSet);
                    setShowDeleteConfirm(true);
                  }}
                  title="Delete current set"
                >
                  <TrashIcon />
                  Delete Set
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={handleSyncAllToBoard}
                disabled={cards.length === 0}
                style={cards.length === 0 ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                title={
                  cards.length === 0
                    ? "Add cards to enable sync"
                    : "Save and push all priority badges in this set to visible Trello board cards"
                }
              >
                {syncSuccess ? "✓ Badges Synced to Board" : "⚡ Sync to Board Cards"}
              </button>

              <button
                type="button"
                className="prio-btn-primary"
                onClick={handleToggleRank}
                disabled={cards.length === 0}
                style={cards.length === 0 ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                title={
                  cards.length === 0
                    ? "Add cards to enable ranking"
                    : "Rank cards from highest score to lowest"
                }
              >
                <RankIcon />
                {isSortedByRank ? "Reset Ranking" : "Auto-Rank Cards"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Docked Footer - only displayed on main cards screen */}
      {activeView === "cards" && (
        <footer className="prio-footer-bar">
          <p className="prio-footer-tip">
            <span>💡</span> Tip: You can also score cards individually by clicking Edit scores on any card.
          </p>
          <span className="prio-footer-brand">Task Prioritize Power-Up</span>
        </footer>
      )}

      {/* Add New Set Dialog */}
      {showAddSetDialog && (
        <div className="prio-overlay" onClick={() => setShowAddSetDialog(false)}>
          <form
            className="prio-dialog"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateSet}
          >
            <div className="prio-dialog-head">
              <h3 className="prio-dialog-title">New Evaluation Set</h3>
              <p className="prio-dialog-desc">
                Organize cards into evaluation groups for upcoming sprints or quarters.
              </p>
            </div>

            <div>
              <input
                type="text"
                placeholder="e.g. Q4 Sprint, Growth Backlog"
                className="prio-text-input"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="prio-dialog-foot">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={() => setShowAddSetDialog(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="prio-btn-primary"
              >
                Create Set
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Set Confirmation */}
      {showDeleteConfirm && (
        <div
          className="prio-overlay"
          onClick={() => {
            setShowDeleteConfirm(false);
            setSetToDelete(null);
          }}
        >
          <div className="prio-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prio-dialog-head">
              <h3 className="prio-dialog-title" style={{ color: "#F87168" }}>
                Delete Set: {(setToDelete || activeSet)?.name || "Untitled Set"}?
              </h3>
              <p className="prio-dialog-desc">
                Are you sure you want to remove this evaluation set? Cards on your Trello board will not be deleted.
              </p>
            </div>

            <div className="prio-dialog-foot">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSetToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="prio-btn-danger-subtle"
                style={{
                  background: "rgba(248, 113, 104, 0.15)",
                  border: "1px solid rgba(248, 113, 104, 0.4)",
                  color: "#F87168",
                }}
                onClick={() => handleDeleteSet((setToDelete || activeSet)?.id)}
              >
                Delete Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Picker Dialog */}
      {showCardPicker && (
        <div className="prio-overlay" onClick={() => setShowCardPicker(false)}>
          <div
            className="prio-card-picker-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prio-card-picker-header">
              <div className="prio-picker-title-row">
                <h3 className="prio-picker-title">Add Cards to {activeSet.name}</h3>
                <button
                  type="button"
                  className="prio-btn-text"
                  onClick={() => setShowCardPicker(false)}
                  style={{ fontSize: "16px", padding: "2px 8px", color: "#9FADBC" }}
                >
                  ✕
                </button>
              </div>
              <p className="prio-picker-subtitle">
                Select cards from your Trello board to evaluate in this set.
              </p>
              <div className="prio-picker-search-bar">
                <input
                  type="text"
                  className="prio-picker-search-input"
                  placeholder="Search cards on board..."
                  value={cardSearchQuery}
                  onChange={(e) => setCardSearchQuery(e.target.value)}
                  autoFocus
                />
                <select
                  className="prio-picker-list-filter"
                  value={selectedListFilter}
                  onChange={(e) => setSelectedListFilter(e.target.value)}
                >
                  <option value="all">All Lists</option>
                  {pickerLists.map((ln) => (
                    <option key={ln} value={ln}>
                      {ln}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="prio-picker-controls-row">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  className="prio-picker-link-btn primary"
                  onClick={() => handlePickerSelectAll(filteredPickerCards)}
                >
                  Select All Visible
                </button>
                <span className="prio-picker-link-divider">|</span>
                <button
                  type="button"
                  className="prio-picker-link-btn"
                  onClick={handlePickerClearAll}
                >
                  Clear Selection
                </button>
              </div>
              <span>
                {selectedCardIdsForPicker.size} of {availablePool.length} selected
              </span>
            </div>

            <div className="prio-picker-list-scroll">
              {filteredPickerCards.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px", color: "#738496" }}>
                  No cards match your search or filter.
                </div>
              ) : (
                filteredPickerCards.map((c) => {
                  const isChecked = selectedCardIdsForPicker.has(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`prio-picker-card-item ${isChecked ? "selected" : ""}`}
                      onClick={() => handleTogglePickerCard(c.id)}
                    >
                      <div className="prio-picker-card-left">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePickerCard(c.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ cursor: "pointer", accentColor: "#579DFF" }}
                        />
                        <span className="prio-picker-card-title">{c.name}</span>
                      </div>
                      {c.listName && (
                        <span className="prio-picker-list-tag">{c.listName}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="prio-card-picker-footer">
              <span className="prio-picker-footer-count">
                Selected: <strong>{selectedCardIdsForPicker.size}</strong> cards
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="prio-btn-secondary"
                  onClick={() => setShowCardPicker(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="prio-btn-primary"
                  onClick={handleSaveCardPicker}
                >
                  Save & Add to Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
