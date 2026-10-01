"""Catalog of chronic conditions and the feeding constraints each one imposes.

Values are conservative orders of magnitude from equine nutrition guidelines
(PSSM1: Valberg, EMS/laminitis: ECEIM consensus, EGUS: ECEIM 2015). They never
replace a veterinarian.
"""

from pydantic import BaseModel

class ConditionRule(BaseModel):
    code: str
    label: str
    summary: str
    forage_min_pct: float = 1.5
    forage_max_pct: float = 2.5
    no_cereals: bool = False
    starch_cap_g_per_kg_meal: float | None = None
    min_meals: int = 2
    fat_ml_per_kg: float = 0.0
    vitamin_e_iu_per_kg: float = 1.0
    recommended: list[str] = []
    avoid: list[str] = []
    advice: list[str] = []

CONDITIONS: dict[str, ConditionRule] = {
    rule.code: rule
    for rule in [
        ConditionRule(
            code="pssm1",
            label="PSSM1",
            summary="Myopathie par surcharge en polysaccharides : sucres et amidon très limités, énergie apportée par les matières grasses.",
            no_cereals=True,
            starch_cap_g_per_kg_meal=0.5,
            min_meals=3,
            fat_ml_per_kg=0.5,
            vitamin_e_iu_per_kg=4.0,
            recommended=["foin pauvre en sucres (NSC < 12 %)", "aliment pauvre en amidon riche en fibres et en gras", "huile végétale"],
            avoid=["céréales (orge, avoine, maïs)", "aliments mélassés", "friandises sucrées"],
            advice=[
                "Sortie au paddock tous les jours, jamais de repos strict au box.",
                "Travail régulier et progressif avec un long échauffement au pas.",
                "Introduire l'huile progressivement sur 2 à 3 semaines.",
            ],
        ),
        ConditionRule(
            code="colic_history",
            label="Coliques à répétition",
            summary="Antécédents de coliques : fourrage abondant, repas de concentré petits et fractionnés, transitions lentes.",
            forage_min_pct=1.8,
            starch_cap_g_per_kg_meal=1.0,
            min_meals=3,
            recommended=["fourrage à volonté ou en filet à petites mailles"],
            avoid=["changement brutal d'aliment", "gros repas de concentré"],
            advice=[
                "Ne jamais laisser plus de 4 à 5 h sans fourrage.",
                "Toute transition alimentaire se fait sur 10 à 14 jours.",
                "Eau propre et tempérée à volonté, surtout en hiver.",
            ],
        ),
        ConditionRule(
            code="ems",
            label="Syndrome métabolique (SME)",
            summary="Insulino-résistance : régime pauvre en sucres et amidon, contrôle du poids.",
            forage_max_pct=2.0,
            no_cereals=True,
            starch_cap_g_per_kg_meal=0.5,
            recommended=["foin trempé 30 à 60 min si le taux de sucres est inconnu", "complément minéral vitaminé (CMV)"],
            avoid=["céréales", "aliments mélassés", "herbe de printemps à volonté"],
            advice=["Limiter l'accès à l'herbe (paddock paradise, panier).", "Peser ou mesurer le tour de ventre toutes les 2 semaines."],
        ),
        ConditionRule(
            code="ppid",
            label="Cushing (PPID)",
            summary="Dysfonctionnement de l'hypophyse : souvent associé à une insulino-résistance, surveiller le poids et les sucres.",
            starch_cap_g_per_kg_meal=1.0,
            recommended=["aliment senior pauvre en amidon"],
            avoid=["aliments mélassés"],
            advice=["Dosage ACTH annuel et suivi du traitement avec le vétérinaire.", "Surveiller la tonte et les pieds (risque de fourbure)."],
        ),
        ConditionRule(
            code="gastric_ulcers",
            label="Ulcères gastriques",
            summary="Estomac fragile : fourrage en continu, luzerne avant le travail, pas de jeûne prolongé.",
            forage_min_pct=1.8,
            starch_cap_g_per_kg_meal=1.0,
            min_meals=3,
            fat_ml_per_kg=0.3,
            recommended=["luzerne (1 à 2 kg avant le travail)", "fourrage disponible en continu"],
            avoid=["travail à jeun", "jeûne de plus de 6 h"],
            advice=["Donner une poignée de fourrage ou de luzerne 30 min avant chaque séance."],
        ),
        ConditionRule(
            code="equine_asthma",
            label="Asthme équin (RAO)",
            summary="Voies respiratoires sensibles : fourrage sans poussière.",
            recommended=["foin trempé ou passé à la vapeur", "enrubanné", "litière dépoussiérée (copeaux, chanvre)"],
            avoid=["foin sec poussiéreux", "paille de litière"],
            advice=["Vie au pré autant que possible, box bien ventilé.", "Distribuer le fourrage au sol."],
        ),
        ConditionRule(
            code="laminitis",
            label="Fourbure",
            summary="Antécédent de fourbure : régime strict pauvre en sucres, pas d'herbe riche.",
            forage_max_pct=2.0,
            no_cereals=True,
            starch_cap_g_per_kg_meal=0.5,
            recommended=["foin trempé", "complément minéral vitaminé (CMV)"],
            avoid=["céréales", "herbe riche (printemps, automne, après gel)", "aliments mélassés"],
            advice=["En crise : box sur sol souple et vétérinaire en urgence.", "Parage régulier toutes les 4 à 6 semaines."],
        ),
        ConditionRule(
            code="hypp",
            label="HYPP",
            summary="Paralysie périodique hyperkaliémique : régime pauvre en potassium.",
            min_meals=3,
            recommended=["foin de graminées (fléole)", "céréales en petites quantités"],
            avoid=["luzerne", "mélasse", "électrolytes riches en potassium"],
            advice=["Repas fréquents et réguliers, sortie quotidienne."],
        ),
        ConditionRule(
            code="dental_issues",
            label="Problèmes dentaires",
            summary="Mastication difficile : fourrage court ou réhydraté.",
            min_meals=3,
            recommended=["fibres réhydratées (bouchons de foin, pulpe de betterave non mélassée)", "foin haché court"],
            avoid=["foin très grossier"],
            advice=["Contrôle dentaire tous les 6 mois.", "Surveiller les boules de foin mâché (quidding)."],
        ),
    ]
}

def describe_conditions(codes: list[str]) -> list[ConditionRule]:
    return [CONDITIONS[code] for code in codes if code in CONDITIONS]
