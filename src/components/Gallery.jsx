import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Download, X } from "lucide-react";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");

  const photos = [
    {
      id: 1,
      title: "✨ Beautiful Sunrise",
      image: "/photos/1.jpg",
    },
    {
      id: 2,
      title: "🎈 A Bundle of Joy",
      image: "/photos/2.jpg",
    },
    {
      id: 3,
      title: "🐶 A Cute Looking Puppy",
      image: "/photos/3.jpg",
    },
    {
      id: 4,
      title: "👣 The First Steps of a Beautiful Story",
      image: "/photos/4.jpg",
    },
    {
      id: 5,
      title: "🌷 Protected by Love",
      image: "/photos/5.jpg",
    },
    {
      id: 6,
      title: "🧿 Her Safest Place In the World",
      image: "/photos/6.jpg",
    },
    {
      id: 7,
      title: "✨ Angel in Pink & My favorite Pic Forever",
      image: "/photos/7.jpg",
    },
    {
      id: 8,
      title: "🌙 Moonlight Smile",
      image: "/photos/8.jpg",
    },
    {
      id: 9,
      title: "🌸 Cute & Charming",
      image: "/photos/9.jpg",
    },
    {
      id: 10,
      title: "👑 Queen of Hearts",
      image: "/photos/10.jpg",
    },
    {
      id: 11,
      title: "💖 Saved Without Permission",
      image: "/photos/11.jpg",
    },
     {
      id: 12,
      title: "💖 The Smile I Admire",
      image: "/photos/12.jpg",
    },
    {
      id: 13,
      title: "👀 Eyes Full of Magic",
      image: "/photos/13.jpg",
    },
    {
      id: 14,
      title: "🌺 Beauty Among Blossoms",
      image: "/photos/14.jpg",
    },
    {
      id: 15,
      title: "💛 Sunshine in Yellow",
      image: "/photos/15.jpg",
    }
  ];

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 py-10">

      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-pink-500">
          Captured Moments ❤️
        </h1>

        <p className="text-gray-400 mt-3">
          Every photo holds a beautiful memory.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full border border-pink-200 bg-white/60 backdrop-blur-md"
        />
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5">

        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03 }}
            className="mb-5 break-inside-avoid"
          >
            <img
              src={photo.image}
              alt={photo.title}
              onClick={() => setSelectedImage(photo)}
              className="rounded-3xl shadow-xl cursor-pointer w-full"
            />

            <div className="flex justify-between items-center mt-2 px-2">
              <h3 className="text-sm font-semibold">
                {photo.title}
              </h3>

              <div className="flex gap-3">
                <Heart
                  size={18}
                  className="text-pink-500 cursor-pointer"
                />

                <a
                  href={photo.image}
                  download
                >
                  <Download
                    size={18}
                    className="text-purple-500"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-5 right-5 text-white">
              <X size={35} />
            </button>

            <img
              src={selectedImage.image}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}