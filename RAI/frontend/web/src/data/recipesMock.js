const recipesMock = {
    high_protein: [
    {
        title: "Ground Turkey Chili",
        url: "https://healthyfitnessmeals.com/ground-turkey-chili/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "1 tablespoon olive oil",
        "1 medium onion, diced",
        "1 1/2 pounds ground turkey",
        "3-4 garlic cloves, minced"
        ],
        instructions: [
        "Heat olive oil in a Dutch oven over medium heat.",
        "Add onion and cook for 3-4 minutes.",
        "Add ground turkey and cook until no longer pink."
        ],
        calories: "444",
        protein: "37"
    },
    {
        title: "Protein Chicken Bowl",
        url: "https://healthyfitnessmeals.com/protein-chicken-bowl/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Chicken breast",
        "Cooked rice",
        "Greek yogurt sauce",
        "Mixed vegetables"
        ],
        instructions: [
        "Cook chicken until golden.",
        "Prepare rice and vegetables.",
        "Serve everything in a bowl with sauce."
        ],
        calories: "520",
        protein: "45"
    },
    {
        title: "Lean Beef Meal Prep",
        url: "https://healthyfitnessmeals.com/lean-beef-meal-prep/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Lean ground beef",
        "Sweet potatoes",
        "Broccoli",
        "Seasoning"
        ],
        instructions: [
        "Cook beef in a pan.",
        "Roast sweet potatoes.",
        "Steam broccoli and combine everything."
        ],
        calories: "610",
        protein: "48"
    },
    {
        title: "High Protein Pasta",
        url: "https://healthyfitnessmeals.com/high-protein-pasta/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Protein pasta",
        "Chicken breast",
        "Tomato sauce",
        "Parmesan"
        ],
        instructions: [
        "Boil pasta.",
        "Cook chicken with tomato sauce.",
        "Mix everything together and serve."
        ],
        calories: "580",
        protein: "42"
    },
    {
        title: "Greek Yogurt Chicken Salad",
        url: "https://healthyfitnessmeals.com/greek-yogurt-chicken-salad/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Chicken breast",
        "Greek yogurt",
        "Celery",
        "Red onion"
        ],
        instructions: [
        "Cook and shred the chicken.",
        "Mix Greek yogurt with vegetables.",
        "Combine everything and chill before serving."
        ],
        calories: "390",
        protein: "41"
    },
    {
        title: "Turkey Rice Skillet",
        url: "https://healthyfitnessmeals.com/turkey-rice-skillet/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Ground turkey",
        "Cooked rice",
        "Bell peppers",
        "Tomato paste"
        ],
        instructions: [
        "Brown turkey in a skillet.",
        "Add peppers and tomato paste.",
        "Stir in rice and cook until warm."
        ],
        calories: "505",
        protein: "39"
    },
    {
        title: "Chicken Fajita Meal Prep",
        url: "https://healthyfitnessmeals.com/chicken-fajita-meal-prep/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Chicken breast",
        "Bell peppers",
        "Onion",
        "Fajita seasoning"
        ],
        instructions: [
        "Slice chicken and vegetables.",
        "Cook everything in a hot pan.",
        "Serve with rice or tortillas."
        ],
        calories: "470",
        protein: "43"
    },
    {
        title: "Egg White Breakfast Wrap",
        url: "https://healthyfitnessmeals.com/egg-white-breakfast-wrap/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Egg whites",
        "Whole wheat tortilla",
        "Turkey slices",
        "Spinach"
        ],
        instructions: [
        "Cook egg whites in a pan.",
        "Add turkey and spinach.",
        "Wrap everything in a tortilla."
        ],
        calories: "340",
        protein: "32"
    },
    {
        title: "Salmon Protein Plate",
        url: "https://healthyfitnessmeals.com/salmon-protein-plate/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Salmon fillet",
        "Asparagus",
        "Potatoes",
        "Lemon juice"
        ],
        instructions: [
        "Season salmon with lemon juice.",
        "Bake salmon and vegetables.",
        "Serve warm."
        ],
        calories: "560",
        protein: "40"
    },
    {
        title: "Cottage Cheese Protein Bowl",
        url: "https://healthyfitnessmeals.com/cottage-cheese-protein-bowl/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Cottage cheese",
        "Banana",
        "Oats",
        "Dark chocolate"
        ],
        instructions: [
        "Add cottage cheese to a bowl.",
        "Top with banana and oats.",
        "Finish with dark chocolate."
        ],
        calories: "430",
        protein: "35"
    },
    {
        title: "Spicy Chicken Lettuce Wraps",
        url: "https://healthyfitnessmeals.com/spicy-chicken-lettuce-wraps/",
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
        category: "high_protein",
        ingredients: [
        "Ground chicken",
        "Lettuce leaves",
        "Soy sauce",
        "Chili flakes"
        ],
        instructions: [
        "Cook ground chicken with seasoning.",
        "Spoon chicken into lettuce leaves.",
        "Serve with extra sauce."
        ],
        calories: "360",
        protein: "38"
    }
    ],

  my_favorites: [
    {
      title: "Mongolian Chicken",
      url: "https://healthyfitnessmeals.com/mongolian-chicken/",
      image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2022/10/Ground-turkey-chili-6-600x600.jpg",
      category: "my_favorites",
      ingredients: [
        "1.5 pound boneless skinless chicken breast",
        "1/4 cup cornstarch",
        "2 tablespoons vegetable oil"
      ],
      instructions: [
        "Slice chicken into thin strips.",
        "Coat chicken with cornstarch.",
        "Cook chicken until golden."
      ],
      calories: "395",
      protein: "34"
    }
  ],

  all_recipes: [
    {
      title: "Yogurt Marinated Chicken",
      url: "https://healthyfitnessmeals.com/yogurt-marinated-chicken/",
      image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2026/04/Yogurt-marinated-chicken-9-600x600.jpg",
      category: "all_recipes",
      ingredients: [
        "1 cup plain full-fat yogurt",
        "2 tablespoons olive oil",
        "2 tablespoons lemon juice",
        "3 garlic cloves"
      ],
      instructions: [
        "Combine yogurt, olive oil, lemon juice and garlic.",
        "Add chicken and coat thoroughly.",
        "Grill until cooked through."
      ],
      calories: "319",
      protein: "36"
    }
  ]
};

export default recipesMock;