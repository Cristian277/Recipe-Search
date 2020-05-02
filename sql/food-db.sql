SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
	`userId` mediumint(9) NOT NULL,
	`userName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
	`password` varchar(72) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `users` (`userId`,`userName`,`password`) VALUES
(1,'Albert123','123'),
(2,'Frank123','1234'),
(3,'Robert123','12345'),
(4,'Walter43','12346a'),
(5,'Cholo123','3212'),
(6,'Carol12','1234420s'),
(8,'Karen23','2233'),
(9,'Carl23','22356'),
(10,'tiny123','2267'),
(11,'gitangolo12420','42069'),
(12,'markIsCool','2330'),
(13,'kevin1234','password123'),
(14,'beanie123','yeah123'),
(15,'Einstein232','science'),
(16,'Arturo111','pass'),
(17,'bird833','chirp'),
(18,'dolphin78','iDunno'),
(19,'tigerThing','password12!'),
(20,'octopusSwimming','ocean');


DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
  `recipeId` mediumint(9) NOT NULL,
  `userId` mediumint(9) NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `calories` int(11) DEFAULT NULL,
  `ingredients` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `numberOfServings` int(11) DEFAULT NULL,
  `healthLabel` varchar(200) COLLATE utf8_unicode_ci NOT NULL
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `recipes` (`recipeId`, `userId`, `name`,`image`,`calories`,`ingredients`,`numberOfServings`,`healthLabel`) VALUES
(1,NULL,'Homemade Hamburger Buns','https://www.kingarthurflour.com/sites/default/files/styles/featured_image_2x/public/recipe_legacy/31-3-large.jpg?itok=AGkjUEpN',1000,'3/4 to 1 cup (170g to 227g) lukewarm water, 2 tablespoons (28g) butter, at room temperature,1 large egg, 3 1/2 cups (418g) King Arthur Unbleached All-Purpose Flour',8,'Healthy'),
(2,NULL,'Lemon Drizzle Cake','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/12/recipe-image-legacy-id--1238452_7.jpg?itok=Hnxk9fQn',350,'225g unsalted butter, softened,225g caster sugar,4 eggs,225g self-raising flour,finely grated zest 1 lemon',10,'Freezable'),
(3,NULL,'Ultimate Chocolate Cake','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1043451_11.jpg?itok=Z_w2WOYB',3000,'200g dark chocolate,200g butter, cubed, 1 tbsp instant coffee granules',14,'Sugar Conscious'),
(4,NULL,'Chili con carne','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1001451_6.jpg?itok=UV2FygMI',2000,'1 large onion,1 red pepper, 2 garlic cloves, 1 tbsp oil, 1 heaped tsp hot chilli powder',4,'Freezable'),
(5,NULL,'Carrot Cake','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2012/07/yummy-scrummy-carrot-cake_1.jpg?itok=9WuugmlL',3000,'175 light muscovado sugar,175 ml sunflower oil,3 large eggs,lightly beaten, 140g grated carrot(about 3 medium),100g raisins',15,'Dairy-free'),
(6,NULL,'Chocoltae Brownies','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1001464_11.jpg?itok=Va_PfXJj',11000,'185g unsalted butter, 185g best dark chocolate, 85g plain flour, 40g cocoa powder, 50g white cholocate',32,'Sugar Conscious'),
(7,NULL,'Spiced Carrot and Lentil Soup','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1074500_11.jpg?itok=IwEifJO_',500,'2 tsp cumin seeds, pinch chilli flakes, 2 tbsp olive oil, 600g carrots, washed and coarsely grated(no need to peel),140g split red lentils',4,'Healthy'),
(8,NULL,'Chicken & Chorizo jambalaya','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/12/recipe-image-legacy-id--1274503_8.jpg?itok=y2r-R0BV',1000,'1 tbsp olive oil, 2 chicken breasts, chopped, 1 onion, diced, 1 red pepper, thinly sliced, 2 garlic cloves, crushed',4,'Healthy'),
(9,NULL,'Summer-in-winter chicken','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1035651_10.jpg?itok=4Sn11UC2',800,'1 tbsp olive oil, 4 boneless skinless chicken breasts, 200g pack cherry tomatoes',4,'Healthy'),
(10,NULL,'Spicy root & lentil casserole','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--488691_11.jpg?itok=ExaTspz1',600,'2 tbsp sunflower or vegetable oil, 1 onion, chopped, 2 garlic clove, crushed, 700g potatoes, peeled and cut into chunks, 4 carrot, thickly sliced',4,'Vegetarian'),
(11,NULL,'Mustard Stuffed Chicken','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/12/recipe-image-legacy-id--1274488_8.jpg?itok=vS12pL7b',800,'125g ball mozzarella, torn into small pieces, 50g strong cheddar, grated, 1 tbsp wholegrain mustard, 4 skinless boneless chicken breast fillets, 8 smoked streaky bacon rashers',4,'Healthy'),
(12,NULL,'Classic scones with jam and clotted cream','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1001500_10.jpg?itok=fEr-egEu',400,'350g self-raising flour, plus more for dusting, 1/4 tsp salt, 1 tsp baking powder, 85g butter, cut into cubes',8,'Freezable'),
(13,NULL,'Red Lentil, chickpea & chilli soup','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/12/recipe-image-legacy-id--265545_11.jpg?itok=Qs_SAvtD',400,'2 tsp cumin seeds, large pinch chilli flakes, 1 tbsp olive oil, 1 red onion, chopped, 140g red split lentils',4,'Vegetarian'),
(14,NULL,'Falafel burgers','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/01/recipe-image-legacy-id--326597_11.jpg?itok=0bBEqeae',20000,'400g can chickpea, rinsed and drained, 1 small red onion, rougly chopped, 1 garlic clove, chopped, handful of flat-leaf parsley or curly parsley, 1 tsp ground cumin',8,'Healthy'),
(15,NULL,'Chicken Biryani','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--328452_12.jpg?itok=U8ngdhdS',500,'300g basmati rice, 25g butter, 1 large onion, finely sliced, 1 bay leaf, 3 cardamom pods, small cinnamon stick, 1 tsp turmeric',4,'Healthy'),
(16,NULL,'Raspberry bakewell cake','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--559459_11.jpg?itok=Dg7CFR8B',20000,'140g ground almond,140g butter, softened, 140g golden caster sugar, 140g self-raising flour, 2 eggs, 1 tsp vanilla extract',8,'Freezable'),
(17,NULL,'Classic victoria sandwich','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1001468_10.jpg?itok=A_ULoxzJ',2300,'200g caster sugar, 200g softened butter, 4 eggs, beaten, 200g self-raising flour, 1 tsp baking poweder, 2 tbsp milk',10,'Sugar Conscious'),
(18,NULL,'Creamy courgette lasagne','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1273575_8.jpg?itok=dBBt-qP6',1200,'9 dried lasagne sheets, 1 tbsp sunflower oil, 1 onion, finely chopped, 700g courgette (about6),coarsely grated, 2 garlic cloves, crushed',4,'Vegetarian'),
(19,NULL,'One-pot chicken chasseur','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--337457_12.jpg?itok=BkhdNf4R',400,'1 tsp olive oil, 25g butter, 4 chicken legs, 1 onion, chopped, 2 garlic cloves, crushed, 200g pack small button or chestnut mushrooms, 225ml red wine',4,'Freezable'),
(20,NULL,'Unbelievably easy mince pies','https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/user-collections/my-colelction-image/2015/12/recipe-image-legacy-id--901483_10.jpg?itok=sVpBrKkj',300,'225g cold butter, diced, 350g plain flour, 100g golden caster sugar, 280g mincemeat, 1 small egg, icing sugar, to dust',18,'Freezable');

ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);
  
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipeId`);

ALTER TABLE `users`
  MODIFY `userId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
ALTER TABLE `recipes`
  MODIFY `recipeId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;