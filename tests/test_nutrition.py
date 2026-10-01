from equine.nutrition import MULTI_CONDITION_WARNING, compute_ration

def test_healthy_horse_moderate_work():
    ration = compute_ration(500, "moderate", [])
    assert ration.forage_kg == 9.5
    assert ration.concentrate_kg == 2.5
    assert ration.meals_per_day == 2
    assert ration.starch_cap_g_per_meal is None
    assert ration.oil_ml == 0
    assert ration.water_liters == (25, 40)
    assert ration.warnings == []

def test_rest_has_no_concentrate():
    ration = compute_ration(500, "rest", [])
    assert ration.concentrate_kg == 0
    assert "CMV" in ration.concentrate_type

def test_pssm1_removes_cereals_and_adds_fat():
    ration = compute_ration(500, "moderate", ["pssm1"])
    assert ration.starch_cap_g_per_meal == 250
    assert ration.concentrate_kg == 2.0
    assert "sans céréales" in ration.concentrate_type
    assert ration.oil_ml == 250
    assert ration.vitamin_e_iu == 2000
    assert ration.meals_per_day >= 3
    assert any("céréales" in line for line in ration.advice if line.startswith("À éviter"))

def test_pssm1_at_rest_halves_oil():
    assert compute_ration(500, "rest", ["pssm1"]).oil_ml == 125

def test_colic_history_raises_forage_and_splits_meals():
    ration = compute_ration(500, "intense", ["colic_history"])
    assert ration.forage_kg == 9.0
    assert ration.starch_cap_g_per_meal == 500
    assert ration.max_concentrate_per_meal_kg == 1.7
    assert ration.meals_per_day == 3
    assert any("vétérinaire" in w for w in ration.warnings)

def test_overweight_ems_horse_is_restricted():
    ration = compute_ration(500, "light", ["ems"], body_condition=8)
    assert ration.forage_kg == 8.5
    assert ration.oil_ml == 0
    assert ration.concentrate_kg == 0.6

def test_conflicting_conditions_are_flagged():
    ration = compute_ration(500, "light", ["gastric_ulcers", "hypp"])
    assert not any("luzerne (1" in line for line in ration.advice if line.startswith("À privilégier"))
    assert any("luzerne" in w for w in ration.warnings)
    assert MULTI_CONDITION_WARNING in ration.warnings

def test_unknown_condition_is_reported():
    ration = compute_ration(500, "light", ["dragon_pox"])
    assert ration.conditions == []
    assert ration.warnings == ["Pathologie inconnue ignorée : dragon_pox."]
