pacman::p_load(dplyr, pracma)

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
  merge(nomiees, meta_trimmed, by = "title", all = T)
merged <-
  merge(merged, meta_trimmed, by = "original_title", x.all = T) %>%
  filter(!is.na(is_winner))
