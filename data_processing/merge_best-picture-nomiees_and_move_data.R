pacman::p_load(dplyr, lubridate, rjson)

# load data
nomiees <- read.csv("best-picture-nomiees.csv", stringsAsFactors = FALSE)
meta <- read.csv(file.path("move-dataset-general", "movies_metadata.csv"), stringsAsFactors = FALSE)

# trim meta down to improve performance
meta_trimmed <-
  meta %>%
  select(budget, genres, id, imdb_id, overview, original_title, popularity, revenue, release_date, title)

# rename movie.title to tile
names(nomiees)[5] <- "title"
names(nomiees)[1] <- "oscar_num"

# merge them
merged <- 
  merge(nomiees, meta_trimmed, by = "title", all = T) %>%
  filter(!is.na(is_winner)) %>%
  transform(release_date = as.Date(release_date)) %>%
  mutate(award_year = as.Date(ISOdate(year, 12, 31)))
merged <-
  merged %>%
  filter(award_year - release_date < years(2))

# for movie with more than one generes, make n rows with different genere
final <- data.frame()
for (row in 1:nrow(merged)) {
  a <- merged[row, "budget"]
  b <- merged[row, "genres"]
  c <- merged[row, "id"]
  d <- merged[row, "imdb_id"]
  e <- merged[row, "overview"]
  f <- merged[row, "original_title"]
  g <- merged[row, "popularity"]
  h <- merged[row, "revenue"]
  i <- merged[row, "release_date"]
  j <- merged[row, "title"]
  k <- merged[row, "year"]
  l <- merged[row, "is_winner"]
  # read JSON
  b <- gsub("'", "\"", b)
  b <- fromJSON(b)
  for (genereJSON in b) {
    genere <- genereJSON[2]
    new_row <- data.frame("budget" = a,
                          "genere" = genere,
                          "id" = c,
                          "imdb_id" = d,
                          "overview" = e,
                          "original_title" = f,
                          "popularity" = g,
                          "revenue" = h,
                          "release_date" = i,
                          "title" = j,
                          "year" = k,
                          "is_winner" = l)
    final <- rbind(final, new_row)
  }
}

# no data on 1974, 1975, 1990, 2014, and 2017
write.csv(final, "best-picture.csv")