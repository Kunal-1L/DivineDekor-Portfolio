import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./Gallery.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { FaWhatsapp, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const WA_NUMBER = "919045328550"; 

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type")?.toLowerCase();

  // All items
  const [allItems, setAllItems] = useState([]);
  const [allPage, setAllPage] = useState(1);
  const [loadingAll, setLoadingAll] = useState(false);
  const [hasMoreAll, setHasMoreAll] = useState(true);

  // Filtered items
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredPage, setFilteredPage] = useState(1);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [hasMoreFiltered, setHasMoreFiltered] = useState(true);

  // Lightbox
  const [selected, setSelected] = useState(null);
  const overlayRef = useRef();

  // Observers
  const observerAll = useRef();
  const observerFiltered = useRef();

  useEffect(() => {
      document.title = "TandonDekor - Portfolio";
    }, []);

  const handleLike = async (itemId) => {
    try {
      const response = await fetch(`${apiUrl}/api/gallery/like/${itemId}`, {
        method: "POST",
      });
      const responseJson = await response.json();

      const itemData = responseJson.data;
      const newLikeCount = itemData?.likeCnt;

      if (response.ok) {
        setAllItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, likeCnt: newLikeCount } : item
          )
        );
        setFilteredItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, likeCnt: newLikeCount } : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to like the item:", error);
    }
  };
  // ===== FETCH ALL ITEMS =====
  const fetchAllItems = async () => {
    try {
      setLoadingAll(true);
      const response = await fetch(
        `${apiUrl}/api/gallery?page=${allPage}&limit=12`
      );
      const data = await response.json();

      setAllItems((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = data.items.filter(
          (item) => !existingIds.has(item._id)
        );
        return [...prev, ...newItems];
      });
      setHasMoreAll(data.items.length > 0 && allPage < data.pages);
    } catch (error) {
      console.error("Failed to fetch all gallery items:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  // ===== FETCH FILTERED ITEMS =====
  const fetchFilteredItems = async () => {
    if (!filterType) return;
    try {
      setLoadingFiltered(true);
      const response = await fetch(
        `${apiUrl}/api/gallery/type/${filterType}?page=${filteredPage}&limit=12`
      );
      const data = await response.json();

      setFilteredItems((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = data.items.filter(
          (item) => !existingIds.has(item._id)
        );
        return [...prev, ...newItems];
      });
      setHasMoreFiltered(data.items.length > 0 && filteredPage < data.pages);
    } catch (error) {
      console.error("Failed to fetch filtered gallery items:", error);
    } finally {
      setLoadingFiltered(false);
    }
  };

  // ===== OBSERVER FOR ALL =====
  const lastAllRef = useCallback(
    (node) => {
      if (loadingAll) return;
      if (observerAll.current) observerAll.current.disconnect();

      observerAll.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreAll) {
          setAllPage((prev) => prev + 1);
        }
      });

      if (node) observerAll.current.observe(node);
    },
    [loadingAll, hasMoreAll]
  );

  // ===== OBSERVER FOR FILTERED =====
  const lastFilteredRef = useCallback(
    (node) => {
      if (loadingFiltered) return;
      if (observerFiltered.current) observerFiltered.current.disconnect();

      observerFiltered.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFiltered) {
          setFilteredPage((prev) => prev + 1);
        }
      });

      if (node) observerFiltered.current.observe(node);
    },
    [loadingFiltered, hasMoreFiltered]
  );

  // ===== RESET WHEN FILTER CHANGES =====
  useEffect(() => {
    setFilteredItems([]);
    setFilteredPage(1);
    setHasMoreFiltered(true);
  }, [filterType]);

  // ===== FETCH ON PAGE CHANGE =====
  useEffect(() => {
    fetchAllItems();
  }, [allPage]);

  useEffect(() => {
    if (filterType) fetchFilteredItems();
  }, [filteredPage, filterType]);

  // ===== LIGHTBOX =====
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openLightbox = (item) => {
    setSelected(item);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelected(null);
    document.body.style.overflow = "";
  };

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) closeLightbox();
  };

  // ===== WHATSAPP SHARE URL =====
  const buildShareUrl = (item) => {
    let url = item.filePath || "";
    try {
      const u = new URL(url);
      url = u.href;
    } catch {
      if (url.startsWith("/")) {
        url = `${window.location.origin}${url}`;
      } else if (!url.startsWith("http")) {
        url = `${window.location.origin}/${url}`;
      }
    }
    const text = encodeURIComponent(
      `Hi, I'm interested in getting ${item.fileType} decoration like this image: ${url}\nCould you please provide details about pricing and availability for similar decoration?`
    );
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  };

  // ====== JSX RETURN ======
  return (
    <>
      <Header />
      <div className="gallery-container">
        {filterType && (
          <>
            <h2 className="gallery-title">
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}{" "}
            </h2>
            <div className="line"></div>

            {filteredItems.length > 0 ? (
              <div className="gallery-grid">
                {filteredItems.map((item, index) => (
                  <div
                    ref={
                      index === filteredItems.length - 1
                        ? lastFilteredRef
                        : null
                    }
                    className="gallery-item"
                    key={item._id ?? index}
                    onClick={() => openLightbox(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(item)}
                  >
                    <div className="gallery-item-inner">
                      <div className="image-placeholder" />
                      <img
                        src={item.filePath}
                        alt={`Gallery item ${index + 1}`}
                        loading="lazy"
                        onLoad={(e) => {
                          e.target.style.opacity = 1;
                          if (e.target.previousSibling)
                            e.target.previousSibling.style.display = "none";
                        }}
                      />
                      <div className="gallery-item-type">
                        {item.fileType}
                        <div
                          className="like-section"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(item._id);
                          }}
                        >
                          {item.likeCnt > 0 ? (
                            <>
                              <FaHeart className="heart filled" />
                              <sub className="like-count">{item.likeCnt}</sub>
                            </>
                          ) : (
                            <FaRegHeart className="heart empty" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loadingFiltered && (
                <p className="no-results">No {filterType} decorations found</p>
              )
            )}

            {loadingFiltered && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </>
        )}

        <h2 className="gallery-title">
          {!filterType ? "Our Gallery" : 
          "More Inspirations"}
        </h2>
        <div className="line"></div>

        <div className="gallery-grid">
          {allItems.map((item, index) => (
            <div
              ref={index === allItems.length - 1 ? lastAllRef : null}
              className="gallery-item"
              key={item._id ?? index}
              onClick={() => openLightbox(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(item)}
            >
              <div className="gallery-item-inner">
                <div className="image-placeholder" />
                <img
                  src={item.filePath}
                  alt={`Gallery item ${index + 1}`}
                  loading="lazy"
                  onLoad={(e) => {
                    e.target.style.opacity = 1;
                    if (e.target.previousSibling)
                      e.target.previousSibling.style.display = "none";
                  }}
                />
                <div className="gallery-item-type">
                  {item.fileType}
                  <div
                    className="like-section"
                    onClick={(e) => {
                      e.stopPropagation(); // stop from triggering parent click
                      handleLike(item._id);
                    }}
                  >
                    {item.likeCnt > 0 ? (
                      <FaHeart className="heart filled" />
                    ) : (
                      <FaRegHeart className="heart empty" />
                    )}
                    <sub className="like-count">{item.likeCnt}</sub>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loadingAll && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {selected && (
        <div
          className="lightbox-overlay"
          ref={overlayRef}
          onClick={onOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div
              className="lightbox-body"
              style={{ ["--bg-img"]: `url('${selected.filePath}')` }}
            >
              <img
                src={selected.filePath}
                alt={selected.fileType || "Gallery image"}
                className="lightbox-image"
                loading="eager"
              />
            </div>

            <div className="lightbox-actions">
              <a
                className="wa-button"
                href={buildShareUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send image via WhatsApp"
              >
                <FaWhatsapp /> Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Gallery;
