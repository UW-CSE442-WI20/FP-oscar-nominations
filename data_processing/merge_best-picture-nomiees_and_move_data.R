pacman::p_load(dplyr, lubridate)

# load data
nomiees <- read.csv("best-picture-nomiees.csv", stringsAsFactors = FALSE)
meta <- read.csv(file.path("move-dataset-general", "movies_metadata.csv"), stringsAsFactors = FALSE)

# trim meta down to improve performance
meta_trimmed <-
  meta %>%
  select(budget, genres, id, imdb_id, overview, original_title, popularity, revenue, release_date, title)

# rename movie.title to tile
names(nomiees)[5] <- "title"

# merge them
merged <- 
  merge(nomiees, meta_trimmed, by = "title", all = T) %>%
  filter(!is.na(is_winner)) %>%
  transform(release_date = as.Date(release_date)) %>%
  mutate(award_year = as.Date(ISOdate(year, 12, 31)))
merged <-
  merged %>%
  filter(award_year - release_date < years(2))

# no data on 1974, 1975, 1990, 2014, and 2017
write.csv(merged, "best-picture.csv")