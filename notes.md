---
layout: page
title: "My Notes"
permalink: /notes/
---

<style>
  .note-section { margin-bottom: 2rem; }
  .category-title { 
    border-bottom: 2px solid #eee; 
    padding-bottom: 0.5rem; 
    text-transform: capitalize;
    color: #2a7ae2;
  }
  .note-list { list-style: none; padding-left: 0; }
  .note-item { margin: 0.5rem 0; }
  .note-link { 
    text-decoration: none; 
    font-weight: 500; 
    color: #333; 
  }
  .note-link:hover { color: #2a7ae2; text-decoration: underline; }
</style>

{% assign notes_by_category = site.notes | group_by_exp: "item", "item.relative_path | split: '/' | slice: 1" %}

{% for category in notes_by_category %}
  <section class="note-section">
    <h2 class="category-title">
      {{ category.name | first | capitalize | replace: "_", " " }}
    </h2>
    
    <ul class="note-list">
      {% for note in category.items %}
        <li class="note-item">
          <a class="note-link" href="{{ note.url | relative_url }}">
            {{ note.title | default: note.path }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}