---
tags:
  - core
  - challenge
---

# Context Accumulation

Context Accumulation is a design principle for AI features within [[Studyond]]: each interaction should build up the student's thesis profile over time, enabling increasingly personalized and useful assistance as the student progresses through the [[Thesis Journey]].

## The Principle

Rather than starting from zero each session, the system should remember what the student has explored -- their interests, academic stage, field preferences, supervisor interactions, and topic explorations. Over time, this accumulated context allows the [[Student AI Agent]] to provide recommendations that are genuinely tailored rather than generic.

A [[Final-Year Students|final-year student]] who has been exploring sustainability topics in supply chain management for three weeks should not receive the same suggestions as someone opening the platform for the first time. The system should know their trajectory and adapt accordingly.

## Why It Matters

The [[Thesis Journey]] is not a single interaction -- it unfolds over weeks or months across the [[Orientation Stage]], [[Topic and Supervisor Search]], [[Planning Stage]], [[Execution Stage]], and [[Writing and Finalization]]. Without context accumulation, each AI interaction is an isolated event. With it, the platform becomes a persistent, intelligent companion that grows more useful over time.

This principle also supports [[Modular Entry]]: if the system knows where a student is in their journey, it can adapt the experience to meet them there rather than forcing a linear path.

## Current Status

Context Accumulation is not yet implemented on the [[Studyond]] platform. It represents a key part of the [[Opportunity Space]] and a direction for future product development. The [[Challenge Brief]] addresses how this principle could be realized.
